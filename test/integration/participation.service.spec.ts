import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { DataSource, Repository } from 'typeorm';
import { ActivityRepository } from '../../src/modules/activity/domain/repositories/activity.repository';
import {
  ACTIVITY_REPOSITORY,
  ACTIVITY_SCHEDULE_REPOSITORY,
} from '@common/constants';
import { Activity } from '../../src/modules/activity/domain/entities/activity.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Participation } from '../../src/modules/participation/domain/participation.entity';
import { User } from '../../src/modules/user/domain/user.entity';
import { Role } from '../../src/modules/role/domain/role.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { ParticipationService } from '../../src/modules/participation/application/participation.service';
import { ParticipationModule } from '../../src/modules/participation/participation.module';
import { ActivityScheduleRepository } from '../../src/modules/activity/domain/repositories/activity-schedule.repository';
import { DAY_OF_WEEK } from '../../src/modules/activity/domain/types/day-of-week';
import { EActivityScheduleType } from '../../src/modules/activity/domain/types/activity-schedule-type';
import { ActivitySchedule } from '../../src/modules/activity/domain/entities/activity-schedule.entity';

describe('ParticipationService', () => {
  let participationService: ParticipationService;
  let participationRepository: Repository<Participation>;
  let userRepository: Repository<User>;
  let activityScheduleRepository: ActivityScheduleRepository;
  let activityRepository: ActivityRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [getTestMysqlModule(), ParticipationModule],
    }).compile();

    participationService =
      moduleRef.get<ParticipationService>(ParticipationService);
    activityScheduleRepository = moduleRef.get<ActivityScheduleRepository>(
      ACTIVITY_SCHEDULE_REPOSITORY,
    );
    activityRepository = moduleRef.get<ActivityRepository>(ACTIVITY_REPOSITORY);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    participationRepository = moduleRef.get<Repository<Participation>>(
      getRepositoryToken(Participation),
    );
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await participationRepository.delete({});
    await activityScheduleRepository.deleteAll();
    await activityRepository.deleteAll();
    await userRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('apply', () => {
    it('활동에 참가를 신청한다.', async () => {
      // given
      const activity: Activity = Activity.create('배구', 18);
      await activityRepository.save(activity);

      const activitySchedule = ActivitySchedule.create(
        DAY_OF_WEEK.FRIDAY,
        EActivityScheduleType.LUNCH,
        activity,
      );
      await activityScheduleRepository.save(activitySchedule);
      const savedActivityScheduleId = activitySchedule.id;

      const user: User = User.createTeacher(
        '송유현',
        'test@example.com',
        Role.create('USER'),
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);
      const savedUserId = user.id;

      // when
      await participationService.applyParticipation(
        savedActivityScheduleId,
        savedUserId,
      );

      // then
      const participation: Participation =
        await participationRepository.findOne({
          where: {
            user: {
              id: savedUserId,
            },
            activitySchedule: {
              id: savedActivityScheduleId,
            },
          },
          relations: {
            user: true,
            activitySchedule: true,
          },
        });

      expect(participation.id).toBeDefined();
      expect(participation.user.id).toEqual(savedUserId);
      expect(participation.activitySchedule.id).toEqual(
        savedActivityScheduleId,
      );
    });
  });
});
