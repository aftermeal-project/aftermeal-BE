import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { setNestApp } from '@common/middlewares/set-nest-app';
import { AppModule } from '../../src/app.module';
import { ActivityRepository } from '../../src/modules/activity/domain/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants';
import { Activity } from '../../src/modules/activity/domain/activity.entity';

describe('ActivityController (E2E)', () => {
  let app: INestApplication;
  let activityRepository: ActivityRepository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    activityRepository = moduleRef.get<ActivityRepository>(ACTIVITY_REPOSITORY);
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  beforeEach(async () => {
    await activityRepository.delete();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/activities', () => {
    it('활동 목록을 반환해야 합니다.', async () => {
      const activity: Activity = activityRepository.create({
        name: '배드민턴',
        maximumParticipants: 10,
      });
      await activityRepository.save(activity);

      const response = await request(app.getHttpServer()).get('/v1/activities');

      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].name).toBeDefined();
      expect(response.body.data[0].maximumParticipants).toBeDefined();
      expect(response.body.data[0].participantsCount).toBeDefined();
    });
  });
});
