import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { setNestApp } from '@common/utils/src/set-nest-app';
import { DataSource } from 'typeorm';
import { Activity } from '../domain/activity.entity';

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

  describe('GET /v1/activities', () => {
    it('if success, status code is 200', async () => {
      // Given


      // When
      const response = await request(app.getHttpServer())
        .get('/v1/activities');
      console.log(response.body);

      // Then
      expect(response.status).toBe(200);
    });

    it('data have required properties', async () => {
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

    it('maximumParticipants가 숫자로 잘 나오나?', async () => {
      // Given
      //

      const activity = new Activity();
      activity.name = '배드민턴';
      activity.maximumParticipants = 10;
      await dataSource.getRepository(Activity).save(activity);

      // When
      const response = await request(app.getHttpServer()).get('/v1/activities');
      // token

      // Then
      expect(typeof response.body.data[0].maximumParticipants).toBe('number');
    });
  });
});
