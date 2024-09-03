import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from '../../src/modules/activity/application/activity.service';
import { ActivityController } from '../../src/modules/activity/presentation/controllers/activity.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setNestApp } from '../../src/set-nest-app';

const mockActivityService = {
  participate: jest.fn(),
  getActivityList: jest.fn(),
  getActivityDetails: jest.fn(),
  cancelActivityJoin: jest.fn(),
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

  describe('participate', () => {
    it('활동에 참가한다.', async () => {
      // given
      const activityId = 1;
      const user = {
        id: 1,
        email: 'test@example.com',
      };

      // when
      const response = await request(app.getHttpServer())
        .post(`/v1/activities/${activityId}/joins`)
        .send(user);

      // then
      expect(response.status).toBe(201);
    });
  });

  describe('getActivityByActivityId', () => {
    it('활동 ID를 통해 활동을 가져온다.', async () => {
      // given
      const activityId = 1;

      // when
      const response = await request(app.getHttpServer()).get(
        `/v1/activities/${activityId}`,
      );

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('getActivityList', () => {
    it('활동 목록을 가져온다.', async () => {
      // when
      const response = await request(app.getHttpServer()).get('/v1/activities');

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('getActivityDetailsByActivityId', () => {
    it('활동 ID를 통해 해당하는 활동의 상세 정보를 가져온다.', async () => {
      // given
      const activityId = 1;

      // when
      const response = await request(app.getHttpServer()).get(
        `/v1/activities/${activityId}`,
      );

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('cancelActivityJoin', () => {
    it('활동 참가를 취소한다.', async () => {
      // given
      const activityId = 1;
      const participationId = 1;

      const user = {
        id: 1,
        email: 'test@example.com',
      };

      // when
      const response = await request(app.getHttpServer())
        .delete(`/v1/activities/${activityId}/joins/${participationId}`)
        .send(user);

      // then
      expect(response.status).toBe(200);
    });
  });
});
