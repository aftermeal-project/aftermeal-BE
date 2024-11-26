import { ActivityService } from '../../../src/modules/activity/application/services/activity.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { DataSource } from 'typeorm';
import {
  ACTIVITY_LOCATION_REPOSITORY,
  ACTIVITY_REPOSITORY,
  PARTICIPATION_REPOSITORY,
  ROLE_REPOSITORY,
  TIME,
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
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { ActivityListResponseDto } from '../../../src/modules/activity/presentation/dto/activity-list-response.dto';
import { ActivityRepository } from '../../../src/modules/activity/domain/repositories/activity.repository';
import { EActivityType } from '../../../src/modules/activity/domain/entities/activity-type';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { ActivityLocationRepository } from '../../../src/modules/activity-location/domain/repositories/activity-location.repository';
import { UserRepository } from '../../../src/modules/user/domain/repositories/user.repository';
import { ParticipationRepository } from '../../../src/modules/participation/domain/repositories/participation.repository';
import { UserTypeormRepository } from '../../../src/modules/user/infrastructure/persistence/user-typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationTypeormRepository } from '../../../src/modules/participation/infrastructure/persistence/participation-typeorm.repository';
import { ActivityCreationRequestDto } from '../../../src/modules/activity/presentation/dto/activity-creation-request.dto';
import { RoleRepository } from '../../../src/modules/role/domain/repositories/role.repository';
import { RoleTypeormRepository } from '../../../src/modules/role/infrastructure/persistence/role-typeorm.repository';
import { ActivityUpdateRequestDto } from '../../../src/modules/activity/presentation/dto/activity-update-request.dto';
import { ActivityTypeormRepository } from '../../../src/modules/activity/infrastructure/persistence/activity-typeorm.repository';
import { ActivityLocationTypeormRepository } from '../../../src/modules/activity-location/infrastructure/persistence/activity-location-typeorm.repository';
import { StubTime } from '../../utils/stub-time';
import { ActivityLocationService } from '../../../src/modules/activity-location/application/services/activity-location.service';
import { ActivityResponseDto } from '../../../src/modules/activity/presentation/dto/activity-response.dto';
import { TimeService } from '@common/time/time.service';
import { ActivityQueryDto } from '../../../src/modules/activity/presentation/dto/activity-query.dto';

describe('ActivityService', () => {
  let activityService: ActivityService;
  let timeService: TimeService;
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
        TypeOrmModule.forFeature([
          Activity,
          ActivityLocation,
          User,
          Role,
          Participation,
        ]),
      ],
      providers: [
        ActivityService,
        ActivityLocationService,
        {
          provide: TIME,
          useValue: new StubTime(
            ZonedDateTime.of(
              LocalDate.of(2024, 1, 1),
              LocalTime.of(),
              ZoneOffset.UTC,
            ),
          ),
        },
        {
          provide: ACTIVITY_REPOSITORY,
          useClass: ActivityTypeormRepository,
        },
        {
          provide: ACTIVITY_LOCATION_REPOSITORY,
          useClass: ActivityLocationTypeormRepository,
        },
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
    timeService = moduleRef.get<TimeService>(TIME);
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

  describe('createActivity', () => {
    it('활동을 생성한다.', async () => {
      // given
      const activityLocation: ActivityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const dto: ActivityCreationRequestDto = {
        title: '배구',
        maxParticipants: 18,
        activityLocationId: activityLocation.id,
        type: EActivityType.LUNCH,
        scheduledDate: LocalDate.of(2024, 1, 3),
      };

      // when
      await activityService.createActivity(dto, timeService.now());

      // then
      const activities: Activity[] = await activityRepository.find();

      expect(activities.length).toBe(1);
      expect(activities[0].title).toBe('배구');
      expect(activities[0].maxParticipants).toBe(18);
    });
  });

  describe('getActivityResponseById', () => {
    it('활동 ID를 통해 활동 응답을 가져온다.', async () => {
      // given
      const activityLocation: ActivityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = User.createTeacher(
        '송유현',
        'test@exaple.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      const activity: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.of(2024, 1, 3),
        timeService.now(),
      );
      await activityRepository.save(activity);

      const participation: Participation = new Participation();
      participation.user = user;
      participation.activity = activity;
      await participationRepository.save(participation);

      // when
      const result: ActivityResponseDto =
        await activityService.getActivityResponseById(activity.id);

      // then
      expect(result.id).toEqual(activity.id);
      expect(result.participations[0].user.id).toBe(user.id);
      expect(result.participations[0].user.generationNumber).toBe(null);
    });

    it('존재하지 않는 활동은 가져올 수 없다.', async () => {
      // given
      const nonExistentId: number = 0;

      // when
      const result = activityService.getActivityResponseById(nonExistentId);

      // then
      await expect(result).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('getActivityListResponseByDate', () => {
    it('특정 날짜에 해당하는 활동 목록 응답을 가져온다.', async () => {
      // given
      const activityLocation: ActivityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = User.createTeacher(
        '송유현',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      const scheduledDate: LocalDate = LocalDate.of(2024, 1, 3);

      const activity: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        scheduledDate,
        timeService.now(),
      );
      await activityRepository.save(activity);

      const participation: Participation = new Participation();
      participation.user = user;
      participation.activity = activity;
      await participationRepository.save(participation);

      const query: ActivityQueryDto = {
        date: scheduledDate,
      };

      // when
      const result: ActivityListResponseDto[] =
        await activityService.getActivityListResponseByDate(query);

      // then
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(activity.id);
      expect(result[0].title).toBe('배구');
      expect(result[0].location).toBe('GYM');
      expect(result[0].maxParticipants).toBe(18);
      expect(result[0].currentParticipants).toBe(1);
      expect(result[0].type).toBe('LUNCH');
      expect(result[0].applicationStartAt).toEqual('2024-01-03T08:30Z');
      expect(result[0].applicationEndAt).toEqual('2024-01-03T12:00Z');
    });
  });

  describe('updateActivity', () => {
    it('활동을 수정한다.', async () => {
      // given
      const activityLocation: ActivityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const activity: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.of(2024, 1, 3),
        timeService.now(),
      );
      await activityRepository.save(activity);

      const updateTitle: string = '농구';
      const updateMaxParticipants: number = 12;
      const updateScheduledDate: LocalDate = LocalDate.of(2024, 1, 10);
      const updateActivityType: EActivityType = EActivityType.DINNER;

      const updateActivityLocation: ActivityLocation =
        ActivityLocation.create('GROUND');
      await activityLocationRepository.save(updateActivityLocation);

      const dto: ActivityUpdateRequestDto = {
        title: updateTitle,
        maxParticipants: updateMaxParticipants,
        activityLocationId: updateActivityLocation.id,
        type: updateActivityType,
        scheduledDate: updateScheduledDate,
      };

      // when
      await activityService.updateActivity(activity.id, dto);

      // then
      const savedActivities: Activity[] = await activityRepository.find();

      expect(savedActivities[0].id).toEqual(activity.id);
      expect(savedActivities[0].title).toBe(updateTitle);
      expect(savedActivities[0].maxParticipants).toBe(updateMaxParticipants);
      expect(savedActivities[0].type).toBe(updateActivityType);
      expect(savedActivities[0].scheduledDate).toEqual(updateScheduledDate);
      expect(savedActivities[0].location.id).toBe(updateActivityLocation.id);
    });
  });

  describe('deleteActivity', () => {
    it('활동을 삭제한다.', async () => {
      // given
      const activityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(0, 0),
        ZoneOffset.UTC,
      );
      const scheduledDate: LocalDate = LocalDate.of(2024, 1, 3);

      const activity: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        scheduledDate,
        now,
      );
      await activityRepository.save(activity);

      // when
      await activityService.deleteActivity(activity.id);

      // then
      const activities: Activity[] = await activityRepository.find();
      expect(activities).toEqual([]);
    });
  });

  describe('getActivityById', () => {
    it('활동 ID를 통해 활동을 가져온다.', async () => {
      // given
      const activityLocation: ActivityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const activity: Activity = Activity.create(
        '배구',
        18,
        activityLocation,
        EActivityType.LUNCH,
        LocalDate.of(2024, 1, 3),
        timeService.now(),
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
      const nonExistentId: number = 0;

      // when
      const result = activityService.getActivityById(nonExistentId);

      // then
      await expect(result).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
