import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { DataSource } from 'typeorm';
import { ActivityRepository } from '../../../src/modules/activity/domain/repositories/activity.repository';
import {
  ACTIVITY_LOCATION_REPOSITORY,
  ACTIVITY_REPOSITORY,
  PARTICIPATION_REPOSITORY,
  TIME,
  USER_REPOSITORY,
} from '@common/constants/dependency-token';
import { Activity } from '../../../src/modules/activity/domain/entities/activity.entity';
import { Participation } from '../../../src/modules/participation/domain/entities/participation.entity';
import { User } from '../../../src/modules/user/domain/entities/user.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { ParticipationService } from '../../../src/modules/participation/application/services/participation.service';
import { EActivityType } from '../../../src/modules/activity/domain/entities/activity-type';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { ActivityLocationRepository } from '../../../src/modules/activity-location/domain/repositories/activity-location.repository';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { ParticipationRepository } from '../../../src/modules/participation/domain/repositories/participation.repository';
import { UserRepository } from '../../../src/modules/user/domain/repositories/user.repository';
import { ParticipationTypeormRepository } from '../../../src/modules/participation/infrastructure/persistence/participation-typeorm.repository';
import { UserTypeormRepository } from '../../../src/modules/user/infrastructure/persistence/user-typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StubTime } from '../../utils/stub-time';
import { ActivityModule } from '../../../src/modules/activity/activity.module';
import { TimeService } from '@common/infrastructure/time/time.service';

describe('ParticipationService', () => {
  let participationService: ParticipationService;
  let participationRepository: ParticipationRepository;
  let userRepository: UserRepository;
  let activityRepository: ActivityRepository;
  let activityLocationRepository: ActivityLocationRepository;
  let timeService: TimeService;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        TypeOrmModule.forFeature([Participation, User]),
        ActivityModule,
      ],
      providers: [
        ParticipationService,
        {
          provide: PARTICIPATION_REPOSITORY,
          useClass: ParticipationTypeormRepository,
        },
        {
          provide: USER_REPOSITORY,
          useClass: UserTypeormRepository,
        },
        {
          provide: TIME,
          useValue: StubTime.of(2024, 1, 1, 11, 30, 0),
        },
      ],
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
    timeService = moduleRef.get<TimeService>(TIME);
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

  describe('participate', () => {
    it('활동에 참여한다.', async () => {
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

      const user: User = User.createTeacher(
        '송유현',
        'test@exaple.com',
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      // when
      await participationService.participate(
        activity.id,
        user.uuid,
        timeService.now(),
      );

      // then
      const participations: Participation[] =
        await participationRepository.find();

      expect(participations.length).toEqual(1);
      expect(participations[0].id).toBeDefined();
      expect(participations[0].user.id).toBeDefined();
    });
  });

  describe('deleteParticipation', () => {
    it('참가를 삭제한다.', async () => {
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

      const user: User = User.createTeacher(
        '송유현',
        'test@exaple.com',
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      const ableDateTime: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 3),
        LocalTime.of(11, 30),
        ZoneOffset.UTC,
      );

      activity.participations = []; // initializers
      const participation: Participation = Participation.create(
        activity,
        user,
        ableDateTime,
      );
      await participationRepository.save(participation);

      // when
      await participationService.deleteParticipation(participation.id);

      // then
      const participations: Participation[] =
        await participationRepository.find();

      expect(participations.length).toEqual(0);
    });
  });
});
