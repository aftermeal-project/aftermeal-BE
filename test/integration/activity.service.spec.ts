import { ActivityService } from '../../src/modules/activity/application/activity.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ActivityModule } from '../../src/modules/activity/activity.module';
import { DataSource, Repository } from 'typeorm';
import { ActivityRepository } from '../../src/modules/activity/domain/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants';
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
import { ActivitySummaryResponseDto } from '../../src/modules/activity/presentation/dto/activity-summary-response.dto';
import { ActivityInfoResponseDto } from '../../src/modules/activity/presentation/dto/activity-info-response.dto';

describe('ActivityService', () => {
  let sut: ActivityService;
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

    sut = moduleRef.get<ActivityService>(ActivityService);
    activityRepository = moduleRef.get<ActivityRepository>(ACTIVITY_REPOSITORY);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    participationRepository = moduleRef.get<Repository<Participation>>(
      getRepositoryToken(Participation),
    );
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await participationRepository.delete({});
    await activityRepository.deleteAll();
    await userRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('getOneByActivityId', () => {
    it('ID로 활동을 가져온다.', async () => {
      // given
      const activity: Activity = Activity.create('배구', 18);
      const { id } = await activityRepository.save(activity);

      // when
      const actual: Activity = await sut.getActivityById(id);

      // then
      expect(actual.id).toBeDefined();
      expect(actual.name).toBe('배구');
      expect(actual.maxParticipants).toBe(18);
    });

    it('존재하지 않는 활동은 가져올 수 없다.', async () => {
      // given
      const activity: Activity = Activity.create('배구', 18);
      await activityRepository.save(activity);

      // when
      const actual = async () => {
        await sut.getActivityById(0);
      };

      // then
      await expect(actual).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActivitySummaries', () => {
    it('활동 요약 목록을 가져온다.', async () => {
      // given
      const activity1: Activity = Activity.create('배구', 18);
      const activity2: Activity = Activity.create('배드민턴', 12);
      const activity3: Activity = Activity.create('농구', 8);
      await activityRepository.saveAll([activity1, activity2, activity3]);

      const user1: User = createUser('test1@example.com');
      const user2: User = createUser('test2@example.com');
      const user3: User = createUser('test3@example.com');
      await userRepository.save([user1, user2, user3]);

      const participations: Participation[] = [
        Participation.create(user1, activity1),
        Participation.create(user1, activity2),
        Participation.create(user2, activity2),
        Participation.create(user3, activity2),
      ];
      await participationRepository.save(participations);

      // when
      const actual: ActivitySummaryResponseDto[] =
        await sut.getActivitySummaries();

      // then
      expect(actual[0].id).toBeDefined();
      expect(actual[0].name).toBe('배구');
      expect(actual[0].maxParticipants).toBe(18);
      expect(actual[0].currentParticipants).toBe(1);

      expect(actual[1].id).toBeDefined();
      expect(actual[1].name).toBe('배드민턴');
      expect(actual[1].maxParticipants).toBe(12);
      expect(actual[1].currentParticipants).toBe(3);

      expect(actual[2].id).toBeDefined();
      expect(actual[2].name).toBe('농구');
      expect(actual[2].maxParticipants).toBe(8);
      expect(actual[2].currentParticipants).toBe(0);
    });
  });

  describe('getActivityInfos', () => {
    it('활동 정보 목록을 가져온다.', async () => {
      // given
      const activity1: Activity = Activity.create('배구', 18);
      const activity2: Activity = Activity.create('배드민턴', 12);
      const activity3: Activity = Activity.create('농구', 8);
      await activityRepository.saveAll([activity1, activity2, activity3]);

      // when
      const actual: ActivityInfoResponseDto[] = await sut.getActivityInfos();

      // then
      expect(actual[0].id).toBeDefined();
      expect(actual[0].name).toBe('배구');
      expect(actual[0].maxParticipants).toBe(18);

      expect(actual[1].id).toBeDefined();
      expect(actual[1].name).toBe('배드민턴');
      expect(actual[1].maxParticipants).toBe(12);

      expect(actual[2].id).toBeDefined();
      expect(actual[2].name).toBe('농구');
      expect(actual[2].maxParticipants).toBe(8);
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
