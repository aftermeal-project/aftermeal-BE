import { ActivityScheduleService } from '../../src/modules/activity/application/activity-schedule.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ActivityModule } from '../../src/modules/activity/activity.module';
import { DataSource, Repository } from 'typeorm';
import { ActivityRepository } from '../../src/modules/activity/domain/activity.repository';
import {
  ACTIVITY_REPOSITORY,
  ACTIVITY_SCHEDULE_REPOSITORY,
} from '@common/constants';
import { Activity } from '../../src/modules/activity/domain/activity.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from '../../src/modules/participation/domain/participation.entity';
import { User } from '../../src/modules/user/domain/user.entity';
import { Role } from '../../src/modules/role/domain/role.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivityScheduleSummaryResponseDto } from '../../src/modules/activity/presentation/dto/activity-schedule-summary-response.dto';
import { ActivitySchedule } from '../../src/modules/activity/domain/activity-schedule.entity';
import { ActivityScheduleRepository } from '../../src/modules/activity/domain/activity-schedule.repository';
import { DAY_OF_WEEK } from '../../src/modules/activity/domain/day-of-week';
import { ActivityScheduleType } from '../../src/modules/activity/domain/activity-schedule-type';

describe('ActivityScheduleService', () => {
  let activityScheduleService: ActivityScheduleService;
  let activityScheduleRepository: ActivityScheduleRepository;
  let activityRepository: ActivityRepository;
  let userRepository: Repository<User>;
  let participationRepository: Repository<Participation>;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ActivityModule,
        TypeOrmModule.forFeature([User, Participation]),
      ],
    }).compile();

    activityScheduleService = moduleRef.get<ActivityScheduleService>(
      ActivityScheduleService,
    );
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

  describe('getActivityScheduleById', () => {
    it('ID로 활동 일정을 가져온다.', async () => {
      // given
      const activity: Activity = Activity.create('배구', 18);
      const activitySchedule: ActivitySchedule = ActivitySchedule.create(
        DAY_OF_WEEK.FRIDAY,
        ActivityScheduleType.LUNCH,
        activity,
      );
      await activityScheduleRepository.save(activitySchedule);

      const activityScheduleId = activitySchedule.id;

      // when
      const result: ActivitySchedule =
        await activityScheduleService.getActivityScheduleById(
          activityScheduleId,
        );

      // then
      expect(result.id).toEqual(activityScheduleId);
    });

    it('존재하지 않는 활동은 가져올 수 없다.', async () => {
      // given
      const activity: Activity = Activity.create('배구', 18);
      await activityRepository.save(activity);

      const activitySchedule: ActivitySchedule = ActivitySchedule.create(
        DAY_OF_WEEK.FRIDAY,
        ActivityScheduleType.LUNCH,
        activity,
      );
      await activityScheduleRepository.save(activitySchedule);

      // when
      const result = async () => {
        await activityScheduleService.getActivityScheduleById(999999999999);
      };

      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActivityScheduleSummaries', () => {
    it('활동 일정 요약 목록을 가져온다.', async () => {
      // given
      const activity1: Activity = Activity.create('배구', 18);
      const activity2: Activity = Activity.create('배드민턴', 12);
      const activity3: Activity = Activity.create('농구', 8);
      await activityRepository.saveAll([activity1, activity2, activity3]);

      const activitySchedule1: ActivitySchedule = ActivitySchedule.create(
        DAY_OF_WEEK.FRIDAY,
        ActivityScheduleType.LUNCH,
        activity1,
      );
      const activitySchedule2: ActivitySchedule = ActivitySchedule.create(
        DAY_OF_WEEK.FRIDAY,
        ActivityScheduleType.LUNCH,
        activity2,
      );
      const activitySchedule3: ActivitySchedule = ActivitySchedule.create(
        DAY_OF_WEEK.FRIDAY,
        ActivityScheduleType.LUNCH,
        activity3,
      );
      await activityScheduleRepository.saveAll([
        activitySchedule1,
        activitySchedule2,
        activitySchedule3,
      ]);

      const user1: User = createUser('test1@example.com');
      const user2: User = createUser('test2@example.com');
      const user3: User = createUser('test3@example.com');
      await userRepository.save([user1, user2, user3]);

      const participations: Participation[] = [
        Participation.create(user1, activitySchedule1),
        Participation.create(user1, activitySchedule2),
        Participation.create(user2, activitySchedule2),
        Participation.create(user3, activitySchedule2),
      ];
      await participationRepository.save(participations);

      // when
      const result: ActivityScheduleSummaryResponseDto[] =
        await activityScheduleService.getActivityScheduleSummaries();

      // then
      expect(result[0].id).toBeDefined();
      expect(result[0].name).toBe('배구');
      expect(result[0].maxParticipants).toBe(18);
      expect(result[0].currentParticipants).toBe(1);

      expect(result[1].id).toBeDefined();
      expect(result[1].name).toBe('배드민턴');
      expect(result[1].maxParticipants).toBe(12);
      expect(result[1].currentParticipants).toBe(3);

      expect(result[2].id).toBeDefined();
      expect(result[2].name).toBe('농구');
      expect(result[2].maxParticipants).toBe(8);
      expect(result[2].currentParticipants).toBe(0);
    });
  });
});

function createUser(email: string): User {
  return User.createTeacher(
    '송유현',
    email,
    Role.create('USER'),
    'G$K9Vss9-wNX6jOvY',
  );
}
