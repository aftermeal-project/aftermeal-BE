import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { DataSource, Repository } from 'typeorm';
import { ActivityRepository } from '../../src/modules/activity/domain/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants';
import { Activity } from '../../src/modules/activity/domain/activity.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Participation } from '../../src/modules/participation/domain/participation.entity';
import { User } from '../../src/modules/user/domain/user.entity';
import { UserType } from '../../src/modules/user/domain/user-type';
import { UserStatus } from '../../src/modules/user/domain/user-status';
import { Role } from '../../src/modules/role/domain/role.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { ParticipationService } from '../../src/modules/participation/application/participation.service';
import { ParticipationModule } from '../../src/modules/participation/participation.module';

describe('ParticipationService', () => {
  let sut: ParticipationService;
  let participationRepository: Repository<Participation>;
  let userRepository: Repository<User>;
  let activityRepository: ActivityRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [getTestMysqlModule(), ParticipationModule],
    }).compile();

    sut = moduleRef.get<ParticipationService>(ParticipationService);
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

  describe('apply', () => {
    it('활동에 참가를 신청한다.', async () => {
      // given
      const activity: Activity = new Activity('배구', 18);
      const savedActivity: Activity = await activityRepository.save(activity);

      const user: User = User.create(
        '송유현',
        'test@example.com',
        UserType.TEACHER,
        Role.create('USER'),
        UserStatus.ACTIVATE,
        'G$K9Vss9-wNX6jOvY',
      );
      const savedUser: User = await userRepository.save(user);

      // when
      await sut.apply(savedActivity.id, savedUser.id);

      // then
      const participation: Participation =
        await participationRepository.findOne({
          where: {
            user: {
              id: savedUser.id,
            },
            activity: {
              id: savedActivity.id,
            },
          },
          relations: {
            user: true,
            activity: true,
          },
        });

      expect(participation.id).toBeDefined();
      expect(participation.user.id).toEqual(savedUser.id);
      expect(participation.activity.id).toEqual(savedActivity.id);
    });
  });
});
