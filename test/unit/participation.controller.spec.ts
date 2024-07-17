import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setNestApp } from '../../src/set-nest-app';
import { ParticipationController } from '../../src/modules/participation/presentation/participation.controller';
import { ParticipationService } from '../../src/modules/participation/application/participation.service';

const mockParticipationService = {
  apply: jest.fn(),
};
describe('ParticipationController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationController],
      providers: [
        {
          provide: ParticipationService,
          useValue: mockParticipationService,
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  describe('apply', () => {
    it('활동에 참가를 신청한다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/participation')
        .send({
          activityId: 1,
        });

      // then
      expect(response.status).toBe(201);
    });

    it('활동 ID는 필수값이다.', async () => {
      // when
      const response = await request(app.getHttpServer()).post(
        '/v1/participation',
      );

      // then
      expect(response.status).toBe(400);
    });

    it('활동 ID는 양수여야 한다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/participation')
        .send({
          activityId: 'string',
        });

      // then
      expect(response.status).toBe(400);
    });
  });
});
