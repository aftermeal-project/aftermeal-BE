import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { DataSource } from 'typeorm';
import { ActivityRepository } from '../../../src/modules/activity/domain/repositories/activity.repository';
import {
  ACTIVITY_LOCATION_REPOSITORY,
  ACTIVITY_REPOSITORY,
  PARTICIPATION_REPOSITORY, ROLE_REPOSITORY,
  USER_REPOSITORY
} from '@common/constants/dependency-token';
import { Activity } from '../../../src/modules/activity/domain/entities/activity.entity';
import { Participation } from '../../../src/modules/participation/domain/entities/participation.entity';
import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { Role } from '../../../src/modules/role/domain/entities/role.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { ParticipationService } from '../../../src/modules/participation/application/services/participation.service';
import { ParticipationModule } from '../../../src/modules/participation/participation.module';
import { EActivityType } from '../../../src/modules/activity/domain/types/activity-type';
import { LocalDate } from '@js-joda/core';
import { ActivityLocationRepository } from '../../../src/modules/activity-location/domain/repositories/activity-location.repository';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { ParticipationRepository } from '../../../src/modules/participation/domain/entities/participation.repository';
import { UserRepository } from '../../../src/modules/user/domain/repositories/user.repository';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { RoleRepository } from '../../../src/modules/role/domain/repositories/role.repository';

describe('ParticipationService', () => {
  let participationService: ParticipationService;
  let participationRepository: ParticipationRepository;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;
  let activityRepository: ActivityRepository;
  let activityLocationRepository: ActivityLocationRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [getTestMysqlModule(), ParticipationModule],
    }).compile();

    participationService =
      moduleRef.get<ParticipationService>(ParticipationService);
    participationRepository = moduleRef.get<ParticipationRepository>(
      PARTICIPATION_REPOSITORY,
    );
    activityRepository = moduleRef.get<ActivityRepository>(ACTIVITY_REPOSITORY);
    activityLocationRepository = moduleRef.get<ActivityLocationRepository>(
      ACTIVITY_LOCATION_REPOSITORY,
    );
    userRepository = moduleRef.get<UserRepository>(USER_REPOSITORY);
    roleRepository = moduleRef.get<RoleRepository>(ROLE_REPOSITORY);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await participationRepository.deleteAll();
    await activityRepository.deleteAll();
    await activityLocationRepository.deleteAll();
    await roleRepository.deleteAll();
    await userRepository.deleteAll();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('participate', () => {
    it('활동에 참여한다.', async () => {
      // given
      const activityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const activity: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.now(),
      );
      await activityRepository.save(activity);

      const role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = User.createTeacher(
        '송유현',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      // when
      await participationService.participate(activity.id, user.id);

      // then
      const participations: Participation[] =
        await participationRepository.find();

      expect(participations.length).toEqual(1);
    });
  });

  describe('cancelActivityJoin', () => {
    it('활동 참가를 취소한다.', async () => {
      // given
      const activityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const activity: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.now(),
      );
      await activityRepository.save(activity);

      const role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = User.createTeacher(
        '송유현',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      const participation: Participation = Participation.create(user, activity);
      await participationRepository.save(participation);

      // when
      await participationService.deleteParticipation(participation.id, user);

      // then
      const participations: Participation[] =
        await participationRepository.find();

      expect(participations.length).toEqual(0);
    });

    it('일반 사용자가 자신이 참여하지 않은 활동 참여를 취소하려고 할 경우 예외를 반환한다.', async () => {
      // given
      const activityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const activity: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.now(),
      );
      await activityRepository.save(activity);

      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = User.createTeacher(
        '송유현',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      const anotherUser: User = User.createTeacher(
        '송유현',
        'test2@exmaple.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.saveAll([user, anotherUser]);

      const participation: Participation = Participation.create(user, activity);
      await participationRepository.save(participation);

      // when & then
      await expect(
        participationService.deleteParticipation(participation.id, anotherUser),
      ).rejects.toThrow(IllegalArgumentException);
    });
  });
});
