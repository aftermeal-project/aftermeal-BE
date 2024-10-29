import { Inject, Injectable } from '@nestjs/common';
import { Participation } from '../../domain/entities/participation.entity';
import {
  PARTICIPATION_REPOSITORY,
  TIME,
} from '@common/constants/dependency-token';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { User } from '../../../user/domain/entities/user.entity';
import { ZonedDateTime } from '@js-joda/core';
import { ParticipationRepository } from '../../domain/repositories/participation.repository';
import { TimeServices } from '@common/servicies/time.services';
import { ActivityService } from '../../../activity/application/services/activity.service';
import { Activity } from '../../../activity/domain/entities/activity.entity';

@Injectable()
export class ParticipationService {
  constructor(
    @Inject(PARTICIPATION_REPOSITORY)
    private readonly participationRepository: ParticipationRepository,
    private readonly activityService: ActivityService,
    @Inject(TIME)
    private readonly time: TimeServices,
  ) {}

  async getParticipationById(participationId: number): Promise<Participation> {
    const participation: Participation =
      await this.participationRepository.findOneById(participationId);

    if (!participation) {
      throw new ResourceNotFoundException('존재하지 않는 참가입니다.');
    }

    return participation;
  }

  async participate(activityId: number, user: User): Promise<void> {
    const activity: Activity =
      await this.activityService.getActivityById(activityId);

    const currentDateTime: ZonedDateTime = this.time.now();
    const participation: Participation = Participation.create(
      activity,
      user,
      currentDateTime,
    );

    await this.participationRepository.save(participation);
  }

  async deleteParticipation(participationId: number): Promise<void> {
    const participation: Participation =
      await this.getParticipationById(participationId);
    await this.participationRepository.delete(participation);
  }
}
