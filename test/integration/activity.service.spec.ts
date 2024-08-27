import { Activity } from '../../src/modules/activity/domain/activity.entity';
import { ActivityResponseDto } from '../../src/modules/activity/presentation/dto/activity-response.dto';
import { ActivityRepository } from '../../src/modules/activity/domain/activity.repository';
import { DataSource } from 'typeorm';
import { User } from '../../src/modules/user/domain/user.entity';
import { Participation } from '../../src/modules/participation/domain/participation.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ActivityModule } from '../../src/modules/activity/activity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACTIVITY_REPOSITORY } from '@common/constants';
import { ActivityService } from '../../src/modules/activity/application/activity.service';

describe('ActivityService', () => {
  let activityService: ActivityService;
  let activityRepository: ActivityRepository;
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

    activityService = moduleRef.get<ActivityService>(ActivityService);
    activityRepository = moduleRef.get<ActivityRepository>(ACTIVITY_REPOSITORY);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await activityRepository.deleteAll();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('getActivities', () => {
    it('활동 항목 목록을 가져온다.', async () => {
      // given
      const activity1: Activity = Activity.create('배구', 18);
      const activity2: Activity = Activity.create('배드민턴', 12);
      const activity3: Activity = Activity.create('농구', 8);
      await activityRepository.saveAll([activity1, activity2, activity3]);

      // when
      const result: ActivityResponseDto[] =
        await activityService.getActivities();

      // then
      expect(result[0].id).toBeDefined();
      expect(result[0].name).toBe('배구');
      expect(result[0].maxParticipants).toBe(18);

      expect(result[1].id).toBeDefined();
      expect(result[1].name).toBe('배드민턴');
      expect(result[1].maxParticipants).toBe(12);

      expect(result[2].id).toBeDefined();
      expect(result[2].name).toBe('농구');
      expect(result[2].maxParticipants).toBe(8);
    });
  });
});
