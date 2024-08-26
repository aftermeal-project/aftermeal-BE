import { Test, TestingModule } from '@nestjs/testing';
import { ActivityScheduleService } from '../../src/modules/activity/application/activity-schedule.service';
import { ActivityController } from '../../src/modules/activity/presentation/activity.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setNestApp } from '../../src/set-nest-app';
import { ActivityService } from '../../src/modules/activity/application/activity.service';

const mockActivityService = {
  getActivities: jest.fn(),
};

const mockActivityScheduleService = {
  getActivityScheduleSummaries: jest.fn(),
};

describe('ActivityController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityScheduleService,
          useValue: mockActivityScheduleService,
        },
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  describe('getActivityScheduleSummaries', () => {
    it('활동 일정 요약 목록을 가져온다.', async () => {
      // when
      const response = await request(app.getHttpServer()).get(
        '/v1/activities/summary',
      );

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('getActivities', () => {
    it('활동 목록을 가져온다.', async () => {
      // when
      const response = await request(app.getHttpServer()).get('/v1/activities');

      // then
      expect(response.status).toBe(200);
    });
  });
});
