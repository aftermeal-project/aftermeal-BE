import { INestApplication } from '@nestjs/common';
import { AdminActivityController } from '../../src/modules/activity/presentation/controllers/admin-activity.controller';
import { ActivityService } from '../../src/modules/activity/application/activity.service';
import { Test, TestingModule } from '@nestjs/testing';
import { setNestApp } from '../../src/set-nest-app';
import * as request from 'supertest';

const mockActivityService = {
  createActivity: jest.fn(),
  updateActivity: jest.fn(),
  deleteActivity: jest.fn(),
  getActivityById: jest.fn(),
  getActivityList: jest.fn(),
  getActivityDetails: jest.fn(),
};

describe('AdminActivityController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();
    app = module.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  it('AdminActivityController가 정의되어 있는지 확인한다.', () => {
    expect(AdminActivityController).toBeDefined();
  });

  describe('createActivity', () => {
    it('활동을 생성한다.', async () => {
      // given
      const dto = {
        title: '배구',
        maxParticipants: 18,
        locationId: 1,
        type: 'LUNCH',
        scheduledDate: '2021-06-21',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/v1/admin/activities')
        .send(dto);

      // then
      if (response.status !== 201) {
        console.error('Response body:', response.body);
      }
      expect(response.status).toBe(201);
    });
  });

  describe('updateActivity', () => {
    it('활동을 수정한다.', async () => {
      // given
      const activityId = 1;
      const dto = {
        title: '배구',
        maxParticipants: 18,
        locationId: 1,
        type: 'LUNCH',
        scheduledDate: '2021-06-21',
      };

      // when
      const response = await request(app.getHttpServer())
        .patch(`/v1/admin/activities/${activityId}`)
        .send(dto);

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('deleteActivity', () => {
    it('활동을 삭제한다.', async () => {
      // given
      const activityId = 1;

      // when
      const response = await request(app.getHttpServer()).delete(
        `/v1/admin/activities/${activityId}`,
      );

      // then
      expect(response.status).toBe(200);
    });
  });
});
