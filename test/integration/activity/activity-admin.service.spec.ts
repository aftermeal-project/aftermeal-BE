import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { ActivityModule } from '../../../src/modules/activity/activity.module';
import { DataSource } from 'typeorm';
import {
  ACTIVITY_LOCATION_REPOSITORY,
  ACTIVITY_REPOSITORY,
  PARTICIPATION_REPOSITORY,
  USER_REPOSITORY,
} from '@common/constants/dependency-token';
import { Activity } from '../../../src/modules/activity/domain/entities/activity.entity';
import { Participation } from '../../../src/modules/participation/domain/entities/participation.entity';
import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { Role } from '../../../src/modules/role/domain/entities/role.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivityRepository } from '../../../src/modules/activity/domain/repositories/activity.repository';
import { EActivityType } from '../../../src/modules/activity/domain/types/activity-type';
import { LocalDate } from '@js-joda/core';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { ActivityLocationRepository } from '../../../src/modules/activity-location/domain/repositories/activity-location.repository';
import { UserRepository } from '../../../src/modules/user/domain/repositories/user.repository';
import { ActivityCreationRequestDto } from '../../../src/modules/activity/presentation/dto/activity-creation-request.dto';
import { ParticipationRepository } from '../../../src/modules/participation/domain/entities/participation.repository';
import { UserTypeormRepository } from '../../../src/modules/user/infrastructure/persistence/user-typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityAdminService } from '../../../src/modules/activity/application/services/activity-admin.service';
import { ActivityAdminResponseDto } from '../../../src/modules/activity/presentation/dto/activity-admin-response.dto';
import {
  ParticipationTypeormRepository
} from '../../../src/modules/participation/domain/repositories/participation-typeorm.repository';

describe('ActivityService', () => {
  let activityAdminService: ActivityAdminService;
  let activityRepository: ActivityRepository;
  let activityLocationRepository: ActivityLocationRepository;
  let userRepository: UserRepository;
  let participationRepository: ParticipationRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ActivityModule,
        TypeOrmModule.forFeature([User, Participation]),
      ],
      providers: [
        {
          provide: USER_REPOSITORY,
          useClass: UserTypeormRepository,
        },
        {
          provide: PARTICIPATION_REPOSITORY,
          useClass: ParticipationTypeormRepository,
        },
      ],
    }).compile();

    activityAdminService =
      moduleRef.get<ActivityAdminService>(ActivityAdminService);
    activityRepository = moduleRef.get<ActivityRepository>(ACTIVITY_REPOSITORY);
    activityLocationRepository = moduleRef.get<ActivityLocationRepository>(
      ACTIVITY_LOCATION_REPOSITORY,
    );
    userRepository = moduleRef.get<UserRepository>(USER_REPOSITORY);
    participationRepository = moduleRef.get<ParticipationRepository>(
      PARTICIPATION_REPOSITORY,
    );
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await participationRepository.deleteAll();
    await activityRepository.deleteAll();
    await activityLocationRepository.deleteAll();
    await userRepository.deleteAll();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('createActivity', () => {
    it('활동을 생성한다.', async () => {
      // given
      const activityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const dto: ActivityCreationRequestDto = {
        title: '배구',
        maxParticipants: 18,
        locationId: activityLocation.id,
        type: EActivityType.LUNCH,
        scheduledDate: LocalDate.now(),
      };

      // when
      await activityAdminService.createActivity(dto);

      // then
      const activities: Activity[] = await activityRepository.find();

      expect(activities.length).toBe(1);
      expect(activities[0].title).toBe('배구');
      expect(activities[0].maxParticipants).toBe(18);
    });
  });

  describe('getActivityById', () => {
    it('활동 ID를 통해 활동을 가져온다.', async () => {
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

      // when
      const result: Activity = await activityAdminService.getActivityById(
        activity.id,
      );

      // then
      expect(result.id).toEqual(activity.id);
    });

    it('존재하지 않는 활동은 가져올 수 없다.', async () => {
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

      // when
      const result = async () => {
        await activityAdminService.getActivityById(999999999999);
      };

      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllActivities', () => {
    it('활동 목록을 가져온다.', async () => {
      // given
      const activityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const activity1: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.now(),
      );
      const activity2: Activity = Activity.create(
        '배드민턴',
        12,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.now(),
      );
      const activity3: Activity = Activity.create(
        '농구',
        8,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.now(),
      );
      await activityRepository.saveAll([activity1, activity2, activity3]);

      const user1: User = createUser('test1@example.com');
      const user2: User = createUser('test2@example.com');
      const user3: User = createUser('test3@example.com');
      await userRepository.saveAll([user1, user2, user3]);

      const participations: Participation[] = [
        Participation.create(user1, activity1),
        Participation.create(user1, activity2),
        Participation.create(user2, activity2),
        Participation.create(user3, activity2),
      ];
      await participationRepository.saveAll(participations);

      // when
      const result: ActivityAdminResponseDto[] =
        await activityAdminService.getAllActivities();

      // then
      expect(result[0].id).toBeDefined();
      expect(result[0].title).toBe('배구');
      expect(result[0].maxParticipants).toBe(18);
      expect(result[0].participants).toBeDefined();

      expect(result[1].id).toBeDefined();
      expect(result[1].title).toBe('배드민턴');
      expect(result[1].maxParticipants).toBe(12);
      expect(result[1].participants).toBeDefined();

      expect(result[2].id).toBeDefined();
      expect(result[2].title).toBe('농구');
      expect(result[2].maxParticipants).toBe(8);
      expect(result[2].participants).toBeDefined();
    });
  });

  describe('updateActivity', () => {
    it('활동을 수정한다.', async () => {
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

      const updateActivity: Activity = Activity.create(
        '농구',
        12,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.now(),
      );

      // when
      await activityAdminService.updateActivity(activity.id, updateActivity);

      // then
      const result: Activity = await activityAdminService.getActivityById(
        activity.id,
      );
      expect(result.id).toEqual(activity.id);
      expect(result.title).toBe('농구');
      expect(result.maxParticipants).toBe(12);
    });
  });

  describe('deleteActivity', () => {
    it('활동을 삭제한다.', async () => {
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

      // when
      await activityAdminService.deleteActivity(activity.id);

      // then
      const result = async () => {
        await activityAdminService.getActivityById(activity.id);
      };

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });
});

function createUser(email: string = 'test@exaple.com'): User {
  return User.createTeacher(
    '송유현',
    email,
    Role.create('USER'),
    'G$K9Vss9-wNX6jOvY',
  );
}
