import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Participation } from '../domain/participation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityScheduleService } from '../../activity/application/activity-schedule.service';
import { ActivitySchedule } from '../../activity/domain/entities/activity-schedule.entity';
import { UserService } from '../../user/application/user.service';
import { User } from '../../user/domain/user.entity';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
    private readonly activityScheduleService: ActivityScheduleService,
    private readonly userService: UserService,
  ) {}

  async applyParticipation(activityId: number, userId: number): Promise<void> {
    const user: User = await this.userService.getUserById(userId);
    const activitySchedule: ActivitySchedule =
      await this.activityScheduleService.getActivityScheduleById(activityId);

    const participation: Participation = Participation.create(
      user,
      activitySchedule,
    );
    await this.participationRepository.save(participation);
  }
}
