import { Inject, Injectable } from '@nestjs/common';
import { Participation } from '../../domain/entities/participation.entity';
import { ParticipationRepository } from '../../domain/entities/participation.repository';
import { PARTICIPATION_REPOSITORY } from '@common/constants/dependency-token';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { Activity } from '../../../activity/domain/entities/activity.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { UserService } from '../../../user/application/services/user.service';
import { ActivityService } from '../../../activity/application/services/activity.service';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';

@Injectable()
export class ParticipationService {
  constructor(
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
    @Inject(PARTICIPATION_REPOSITORY)
    private readonly participationRepository: ParticipationRepository,
  ) {}

  async participate(activityId: number, userId: number): Promise<void> {
    await this.validateExistParticipation(activityId, userId);

    const activity: Activity =
      await this.activityService.getActivityById(activityId);
    const user: User = await this.userService.getUserById(userId);

    const participation: Participation = Participation.create(user, activity);
    await this.participationRepository.save(participation);
  }

  async getParticipationById(participationId: number): Promise<Participation> {
    const participation: Participation =
      await this.participationRepository.findOneById(participationId);

    if (!participation) {
      throw new NotFoundException('존재하지 않는 참가입니다.');
    }

    return participation;
  }

  async deleteParticipation(
    participationId: number,
    currentUser: User,
  ): Promise<void> {
    const participation: Participation =
      await this.getParticipationById(participationId);

    const isAdmin: boolean = currentUser.roles.some(
      (role) => role.role.name === 'ADMIN',
    );

    if (!isAdmin && participation.user.id !== currentUser.id) {
      throw new IllegalArgumentException('본인의 참가만 삭제할 수 있습니다.');
    }

    const activity: Activity = await participation.activity;

    if (activity.isStarted()) {
      throw new IllegalStateException(
        '이미 시작된 활동에 대한 참가 정보는 삭제할 수 없습니다.',
      );
    }

    await this.participationRepository.delete(participation);
  }

  private async validateExistParticipation(activityId: number, userId: number) {
    const existParticipation: Participation =
      await this.participationRepository.findOneByUserIdAndActivityId(
        activityId,
        userId,
      );

    if (existParticipation) {
      throw new AlreadyExistException('이미 참여한 활동입니다.');
    }
  }
}
