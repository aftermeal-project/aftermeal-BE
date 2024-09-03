import { Inject, Injectable } from '@nestjs/common';
import { Participation } from '../domain/entities/participation.entity';
import { User } from '../../user/domain/entities/user.entity';
import { Activity } from '../../activity/domain/entities/activity.entity';
import { ParticipationRepository } from '../domain/entities/participation.repository';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { PARTICIPATION_REPOSITORY } from '@common/constants/dependency-token';
import { NotFoundException } from '@common/exceptions/not-found.exception';

@Injectable()
export class ParticipationService {
  constructor(
    @Inject(PARTICIPATION_REPOSITORY)
    private readonly participationRepository: ParticipationRepository,
  ) {}

  async getParticipationByUserIdAndActivityId(
    userId: number,
    activityId: number,
  ): Promise<Participation> {
    const participation: Participation | null =
      await this.participationRepository.findByUserIdAndActivityId(
        userId,
        activityId,
      );

    if (!participation) {
      throw new NotFoundException('존재하지 않는 참여 정보입니다.');
    }

    return participation;
  }

  async participate(activity: Activity, user: User): Promise<Participation> {
    const existParticipation: Participation =
      await this.participationRepository.findByUserIdAndActivityId(
        activity.id,
        user.id,
      );

    if (existParticipation) {
      throw new IllegalArgumentException('이미 참여한 활동입니다.');
    }

    const participation: Participation = Participation.create(user, activity);
    await this.participationRepository.save(participation);

    return participation;
  }

  async cancelParticipation(activity: Activity, user: User): Promise<void> {
    const participation: Participation =
      await this.getParticipationByUserIdAndActivityId(user.id, activity.id);
    await this.participationRepository.delete(participation);
  }
}
