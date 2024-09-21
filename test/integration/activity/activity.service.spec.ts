import { ActivityService } from '../../../src/modules/activity/application/services/activity.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { ActivityModule } from '../../../src/modules/activity/activity.module';
import { DataSource } from 'typeorm';
import {
  ACTIVITY_LOCATION_REPOSITORY,
  ACTIVITY_REPOSITORY,
  PARTICIPATION_REPOSITORY,
  ROLE_REPOSITORY,
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
import { ActivitySummaryResponseDto } from '../../../src/modules/activity/presentation/dto/activity-summary-response.dto';
import { ActivityRepository } from '../../../src/modules/activity/domain/repositories/activity.repository';
import { EActivityType } from '../../../src/modules/activity/domain/types/activity-type';
import { LocalDate } from '@js-joda/core';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { ActivityLocationRepository } from '../../../src/modules/activity-location/domain/repositories/activity-location.repository';
import { UserRepository } from '../../../src/modules/user/domain/repositories/user.repository';
import { ParticipationRepository } from '../../../src/modules/participation/domain/entities/participation.repository';
import { UserTypeormRepository } from '../../../src/modules/user/infrastructure/persistence/user-typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationTypeormRepository } from '../../../src/modules/participation/domain/repositories/participation-typeorm.repository';
import { ActivityCreationRequestDto } from '../../../src/modules/activity/presentation/dto/activity-creation-request.dto';
import { RoleRepository } from '../../../src/modules/role/domain/repositories/role.repository';
import { RoleTypeormRepository } from '../../../src/modules/role/infrastructure/persistence/role-typeorm.repository';

describe('ActivityService', () => {
  let activityService: ActivityService;
  let activityRepository: ActivityRepository;
  let activityLocationRepository: ActivityLocationRepository;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;
  let participationRepository: ParticipationRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ActivityModule,
        TypeOrmModule.forFeature([User, Role, Participation]),
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
        {
          provide: ROLE_REPOSITORY,
          useClass: RoleTypeormRepository,
        },
      ],
    }).compile();

    activityService = moduleRef.get<ActivityService>(ActivityService);
    activityRepository = moduleRef.get<ActivityRepository>(ACTIVITY_REPOSITORY);
    activityLocationRepository = moduleRef.get<ActivityLocationRepository>(
      ACTIVITY_LOCATION_REPOSITORY,
    );
    userRepository = moduleRef.get<UserRepository>(USER_REPOSITORY);
    roleRepository = moduleRef.get<RoleRepository>(ROLE_REPOSITORY);
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
    await roleRepository.deleteAll();
  });

  afterAll(async () => {
    await dataSource.destroy();
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
      const result: Activity = await activityService.getActivityById(
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

      // when & then
      await expect(
        activityService.getActivityById(999999999999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActivityList', () => {
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

      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const user1: User = createUser(role, 'test1@example.com');
      const user2: User = createUser(role, 'test2@example.com');
      const user3: User = createUser(role, 'test3@example.com');
      await userRepository.saveAll([user1, user2, user3]);

      const participations: Participation[] = [
        Participation.create(user1, activity1),
        Participation.create(user1, activity2),
        Participation.create(user2, activity2),
        Participation.create(user3, activity2),
      ];
      await participationRepository.saveAll(participations);

      // when
      const result: ActivitySummaryResponseDto[] =
        await activityService.getActivitySummaries();

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
      await activityService.createActivity(dto);

      // then
      const activities: Activity[] = await activityRepository.find();

      expect(activities.length).toBe(1);
      expect(activities[0].title).toBe('배구');
      expect(activities[0].maxParticipants).toBe(18);
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
      await activityService.updateActivity(activity.id, updateActivity);

      // then
      const savedActivity: Activity = await activityRepository.findOneById(
        activity.id,
      );
      expect(savedActivity.id).toEqual(activity.id);
      expect(savedActivity.title).toBe('농구');
      expect(savedActivity.maxParticipants).toBe(12);
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
      await activityService.deleteActivity(activity.id);

      // then
      const activities: Activity[] = await activityRepository.find();
      expect(activities).toEqual([]);
    });
  });
});

function createUser(role: Role, email: string = 'test@exaple.com'): User {
  return User.createTeacher('송유현', email, role, 'G$K9Vss9-wNX6jOvY');
}
