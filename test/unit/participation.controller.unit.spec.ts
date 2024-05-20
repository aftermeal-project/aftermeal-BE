import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setNestApp } from '@common/middlewares/set-nest-app';
import { ParticipationController } from '../../src/modules/participation/presentation/participation.controller';
import { ParticipationService } from '../../src/modules/participation/application/participation.service';

const mockParticipationService = {
  apply: jest.fn(),
};
describe('UserController (Unit)', () => {
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
    it('참가 신청한다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/participation')
        .send({
          activityId: 1,
        });

      // then
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('참가 신청에 성공했습니다.');
    });

    it('참가 신청할 때 activityId는 필수값이다.', async () => {
      // when
      const response = await request(app.getHttpServer()).post(
        '/v1/participation',
      );

      // then
      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe(
        'activityId must be a number conforming to the specified constraints',
      );
    });

    it('참가 신청할 때 activityId는 숫자이여야 한다.', async () => {
      // when
      const response = await request(app.getHttpServer()).post(
        '/v1/participation',
      );

      // then
      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe(
        'activityId must be a number conforming to the specified constraints',
      );
    });
  });
});
