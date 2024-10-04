import { Inject, Injectable } from '@nestjs/common';
import { Participation } from '../../domain/entities/participation.entity';
import { ActivityRepository } from '../../../activity/domain/repositories/activity.repository';
import {
  ACTIVITY_REPOSITORY,
  PARTICIPATION_REPOSITORY,
  TIME,
} from '@common/constants/dependency-token';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { User } from '../../../user/domain/entities/user.entity';
import { ZonedDateTime } from '@js-joda/core';
import { ParticipationRepository } from '../../domain/repositories/participation.repository';
import { Time } from '@common/time/time';

@Injectable()
export class ParticipationService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(PARTICIPATION_REPOSITORY)
    private readonly participationRepository: ParticipationRepository,
    @Inject(TIME)
    private readonly time: Time,
  ) {}

  async participate(activityId: number, user: User): Promise<void> {
    const currentDateTime: ZonedDateTime = this.time.now();
    const activity = await this.activityRepository.findOneById(activityId);

    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동입니다.');
    }

    activity.addParticipant(user, currentDateTime);
    await this.activityRepository.save(activity);
  }

  async deleteParticipation(participationId: number): Promise<void> {
    const participation: Participation =
      await this.participationRepository.findOneById(participationId);

    if (!participation) {
      throw new NotFoundException('존재하지 않는 참가입니다.');
    }

    await this.participationRepository.delete(participation);
  }
}
