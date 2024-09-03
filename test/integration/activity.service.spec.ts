import { ActivityService } from '../../src/modules/activity/application/activity.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ActivityModule } from '../../src/modules/activity/activity.module';
import { DataSource } from 'typeorm';
import {
  ACTIVITY_LOCATION_REPOSITORY,
  ACTIVITY_REPOSITORY,
  PARTICIPATION_REPOSITORY,
  USER_REPOSITORY,
} from '@common/constants/dependency-token';
import { Activity } from '../../src/modules/activity/domain/entities/activity.entity';
import { Participation } from '../../src/modules/participation/domain/entities/participation.entity';
import { User } from '../../src/modules/user/domain/entities/user.entity';
import { Role } from '../../src/modules/role/domain/entities/role.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivityResponseDto } from '../../src/modules/activity/presentation/dto/activity-response.dto';
import { ActivityRepository } from '../../src/modules/activity/domain/repositories/activity.repository';
import { EActivityType } from '../../src/modules/activity/domain/types/activity-type';
import { LocalDate } from '@js-joda/core';
import { ActivityLocation } from '../../src/modules/activity-location/domain/entities/activity-location.entity';
import { ActivityLocationRepository } from '../../src/modules/activity-location/domain/repositories/activity-location.repository';
import { UserRepository } from '../../src/modules/user/domain/repositories/user.repository';
import { ActivityCreationRequestDto } from '../../src/modules/activity/presentation/dto/activity-creation-request.dto';
import { ParticipationRepository } from '../../src/modules/participation/domain/entities/participation.repository';
import { UserTypeormRepository } from '../../src/modules/user/infrastructure/user-typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityParticipationResponseDto } from '../../src/modules/activity/presentation/dto/activity-participation-response.dto';

describe('ActivityService', () => {
  let activityService: ActivityService;
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
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        {
          provide: USER_REPOSITORY,
          useClass: UserTypeormRepository,
        },
      ],
    }).compile();

    activityService = moduleRef.get<ActivityService>(ActivityService);
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
      const activityId: number = await activityService.createActivity(dto);

      // then
      const activity: Activity =
        await activityRepository.findOneById(activityId);

      expect(activity.id).toBeDefined();
      expect(activity.title).toBe('배구');
      expect(activity.maxParticipants).toBe(18);
      expect(activity.location).toEqual(activityLocation);
      expect(activity.type).toBe(EActivityType.LUNCH);
      expect(activity.scheduledDate).toEqual(LocalDate.now());
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
      const result: Activity = await activityService.getActivityByActivityId(
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
        await activityService.getActivityByActivityId(999999999999);
      };

      // then
      await expect(result).rejects.toThrow(NotFoundException);
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
      const result: ActivityResponseDto[] =
        await activityService.getActivityList();

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
      const result: Activity = await activityService.getActivityByActivityId(
        activity.id,
      );

      expect(result.id).toEqual(activity.id);
      expect(result.title).toBe('농구');
      expect(result.maxParticipants).toBe(12);
      expect(result.location).toEqual(activityLocation);
      expect(result.type).toBe(EActivityType.LUNCH);
      expect(result.scheduledDate).toEqual(LocalDate.now());
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
      const result = async () => {
        await activityService.getActivityByActivityId(activity.id);
      };

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('participate', () => {
    it('활동에 참가한다.', async () => {
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

      const user: User = createUser();
      await userRepository.save(user);

      // when
      const result: ActivityParticipationResponseDto =
        await activityService.participate(activity.id, user);

      // then
      const participation: Participation =
        await participationRepository.findOneById(result.participationId);

      expect(participation).toBeDefined();
    });
  });

  describe('cancelActivityJoin', () => {
    it('활동 참여를 취소한다.', async () => {
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

      const user: User = createUser();
      await userRepository.save(user);

      const responseDto: ActivityParticipationResponseDto =
        await activityService.participate(activity.id, user);

      // when
      await activityService.cancelActivityJoin(activity.id, user);

      // then
      const participation: Participation | null =
        await participationRepository.findOneById(responseDto.participationId);

      expect(participation).toBeNull();
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
