import { ActivityService } from '../../src/modules/activity/application/activity.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ActivityModule } from '../../src/modules/activity/activity.module';
import { DataSource, Repository } from 'typeorm';
import { ActivityRepository } from '../../src/modules/activity/domain/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants';
import { ActivityDto } from '../../src/modules/activity/dto/activity.dto';
import { Activity } from '../../src/modules/activity/domain/activity.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from '../../src/modules/participation/domain/participation.entity';
import { User } from '../../src/modules/user/domain/user.entity';
import { UserType } from '../../src/modules/user/domain/user-type';
import { UserStatus } from '../../src/modules/user/domain/user-status';
import { Role } from '../../src/modules/user/domain/role.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { NotFoundException } from '@nestjs/common';

describe('ActivityService (Integration)', () => {
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
    await activityRepository.clear();
    await userRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('getAll', () => {
    it('활동 목록을 반환한다.', async () => {
      // given
      const activity1: Activity = new Activity('배구', 18);
      const activity2: Activity = new Activity('배드민턴', 12);
      const activity3: Activity = new Activity('농구', 8);
      await activityRepository.saveAll([activity1, activity2, activity3]);

      const user1: User = createUser('test1@example.com');
      const user2: User = createUser('test2@example.com');
      const user3: User = createUser('test3@example.com');
      await userRepository.save([user1, user2, user3]);

      const participations: Participation[] = [
        new Participation(user1, activity1),
        new Participation(user1, activity2),
        new Participation(user2, activity2),
        new Participation(user3, activity2),
      ];
      await participationRepository.save(participations);

      // when
      const actual: ActivityDto[] = await sut.getAll();

      // then
      expect(actual[0].id).toBeDefined();
      expect(actual[0].name).toBe('배구');
      expect(actual[0].maximumParticipants).toBe(18);
      expect(actual[0].participantsCount).toBe(1);

      expect(actual[1].id).toBeDefined();
      expect(actual[1].name).toBe('배드민턴');
      expect(actual[1].maximumParticipants).toBe(12);
      expect(actual[1].participantsCount).toBe(3);

      expect(actual[2].id).toBeDefined();
      expect(actual[2].name).toBe('농구');
      expect(actual[2].maximumParticipants).toBe(8);
      expect(actual[2].participantsCount).toBe(0);
    });
  });

  describe('getOneByActivityId', () => {
    it('Id와 일치하는 활동을 가져온다.', async () => {
      // given
      const activity: Activity = new Activity('배구', 18);
      const { id } = await activityRepository.save(activity);

      // when
      const actual: Activity = await sut.getOneByActivityId(id);

      // then
      expect(actual.id).toBeDefined();
      expect(actual.name).toBe('배구');
      expect(actual.maximumParticipants).toBe(18);
    });

    it('존재하지 않는 활동이면 예외가 발생한다.', async () => {
      // given
      const activity: Activity = new Activity('배구', 18);
      await activityRepository.save(activity);

      // when
      const actual = async () => {
        await sut.getOneByActivityId(0);
      };

      // then
      await expect(actual).rejects.toThrowError(
        new NotFoundException('존재하지 않는 활동입니다.'),
      );
    });
  });
});

function createUser(email: string): User {
  return User.create(
    '송유현',
    email,
    UserType.TEACHER,
    Role.create('ROLE_MEMBER'),
    UserStatus.ACTIVATE,
    'password',
  );
}
