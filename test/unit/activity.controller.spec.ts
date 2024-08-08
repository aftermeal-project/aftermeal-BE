import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from '../../src/modules/activity/application/activity.service';
import { ActivityController } from '../../src/modules/activity/presentation/activity.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setNestApp } from '../../src/set-nest-app';

const mockActivityService = {
  getActivityInfos: jest.fn(),
  getActivitySummaries: jest.fn(),
};

describe('ActivityController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
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

  describe('getActivitySummaries', () => {
    it('활동 요약 목록을 가져온다.', async () => {
      // when
      const response = await request(app.getHttpServer()).get('/v1/activities');

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('getActivityInfos', () => {
    it('활동 정보 목록을 가져온다.', async () => {
      // when
      const response = await request(app.getHttpServer()).get(
        '/v1/activities/info',
      );

      // then
      expect(response.status).toBe(200);
    });
  });
});
