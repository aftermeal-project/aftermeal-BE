import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { setNestApp } from '@common/middlewares/set-nest-app';
import { DataSource } from 'typeorm';
import { Activity } from '../src/modules/activity/domain/activity.entity';
import { AppModule } from '../src/app.module';

describe('ActivityController (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = moduleRef.get<DataSource>(DataSource);
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/activities', () => {
    it('빈 배열과 함께 200 반환.', async () => {
      // When
      const response = await request(app.getHttpServer()).get('/v1/activities');

      // Then
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('활동 목록과 함께 200 반환', async () => {
      // Given
      const activity = new Activity();
      activity.name = '배드민턴';
      activity.maximumParticipants = 10;
      await dataSource.getRepository(Activity).save(activity);

      // When
      const response = await request(app.getHttpServer()).get('/v1/activities');

      // Then
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].name).toBeDefined();
      expect(response.body.data[0].maximumParticipants).toBeDefined();
      expect(response.body.data[0].participantsCount).toBeDefined();
    });
  });
});
