import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';


describe('ActivityController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();


    await app.init();
  });

  describe('GET /v1/activities', () => {
    it('if success, status code is 200', async () => {
      // Given


      // When
      const response = await request(app.getHttpServer())
        .get('/activities');
      console.log(response);

      // Then
      expect(response.status).toBe(200);
    });
  });
})