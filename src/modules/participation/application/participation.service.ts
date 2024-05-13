import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Participation } from '../domain/participation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityService } from '../../activity/application/activity.service';
import { Activity } from '../../activity/domain/activity.entity';
import { UserService } from '../../user/application/user.service';
import { User } from '../../user/domain/user.entity';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
  ) {}

  async apply(activityId: number, userId: number): Promise<void> {
    const user: User = await this.userService.getOneById(userId);
    const activity: Activity = await this.activityService.getOneByActivityId(
      activityId,
    );

    const participation: Participation = new Participation(user, activity);
    await this.participationRepository.save(participation);
  }
}
