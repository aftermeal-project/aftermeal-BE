import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setNestApp } from '../../src/set-nest-app';
import { ActivityLocationService } from '../../src/modules/activity-location/application/activity-location.service';
import { AdminActivityLocationController } from '../../src/modules/activity-location/presentation/controllers/admin-activity-location.controller';
import * as request from 'supertest';
import { ActivityLocationCreationRequestDto } from '../../src/modules/activity-location/presentation/dto/activity-location-creation-request.dto';

const mockActivityLocationService = {
  createActivityLocation: jest.fn(),
  getActivityLocations: jest.fn(),
  updateActivityLocation: jest.fn(),
  deleteActivityLocation: jest.fn(),
};

describe('AdminActivityLocationController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AdminActivityLocationController],
      providers: [
        {
          provide: ActivityLocationService,
          useValue: mockActivityLocationService,
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createActivityLocation', () => {
    it('활동 장소를 생성한다.', async () => {
      // given
      const dto: ActivityLocationCreationRequestDto = { name: '강당' };

      // when
      const response = await request(app.getHttpServer())
        .post('/v1/admin/activity-locations')
        .send(dto);

      // then
      expect(response.status).toBe(201);
    });
  });

  describe('getActivityLocations', () => {
    it('활동 장소 목록을 조회한다.', async () => {
      // when
      const response = await request(app.getHttpServer()).get(
        '/v1/admin/activity-locations',
      );

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('updateActivityLocation', () => {
    it('활동 장소를 수정한다.', async () => {
      // given
      const activityLocationId = 1;
      const dto = { name: '운동장' };

      // when
      const response = await request(app.getHttpServer())
        .patch(`/v1/admin/activity-locations/${activityLocationId}`)
        .send(dto);

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('deleteActivityLocation', () => {
    it('활동 장소를 삭제한다.', async () => {
      // given
      const activityLocationId = 1;

      // when
      const response = await request(app.getHttpServer()).delete(
        `/v1/admin/activity-locations/${activityLocationId}`,
      );

      // then
      expect(response.status).toBe(200);
    });
  });
});
