import { ActivityService } from '../application/activity.service';
import { ActivityRepository } from '../domain/activity.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ACTIVITY_REPOSITORY } from '@common/constants';
import { Activity } from '../domain/activity.entity';
import { NotFoundException } from '@nestjs/common';
import { ActivityDto } from '../dto/activity.dto';

class MockActivityRepository {
  findOneByActivityId = jest.fn();
  findActivityDto = jest.fn();
}

describe('ActivityService', () => {
  let sut: ActivityService;
  let activityRepository: ActivityRepository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        { provide: ACTIVITY_REPOSITORY, useClass: MockActivityRepository },
      ],
    }).compile();

    sut = moduleRef.get<ActivityService>(ActivityService);
    activityRepository = moduleRef.get(ACTIVITY_REPOSITORY);
  });

  describe('getActivityById', () => {
    it('존재하는 활동이 있다면 활동을 반환해야 합니다.', async () => {
      const existingActivity = new Activity();
      existingActivity.id = 1;
      existingActivity.name = '배드민턴';
      existingActivity.maximumParticipants = 8;
      jest
        .spyOn(activityRepository, 'findOneByActivityId')
        .mockResolvedValue(existingActivity);

      const actual = await sut.getOneByActivityId(1);

      expect(actual.id).toBe(1);
      expect(actual.name).toBeDefined();
      expect(actual.maximumParticipants).toBeDefined();
    });

    it('존재하는 활동이 없다면 예외를 반환해야 합니다.', async () => {
      jest
        .spyOn(activityRepository, 'findOneByActivityId')
        .mockResolvedValue(null);

      const actual = async () => {
        await sut.getOneByActivityId(1);
      };

      await expect(actual).rejects.toThrowError(
        new NotFoundException('존재하지 않는 활동입니다.'),
      );
    });
  });

  describe('getActivities', () => {
    it('금일 신청 가능한 활동 목록을 반환해야 합니다.', async () => {
      const existingActivity: ActivityDto[] = [
        new ActivityDto(1, '배드민턴', 8, 8),
        new ActivityDto(2, '배구', 18, 12),
      ];
      jest
        .spyOn(activityRepository, 'findActivityDto')
        .mockResolvedValue(existingActivity);

      const actual: ActivityDto[] = await sut.getAll();

      expect(actual).toBe([
        new ActivityDto(1, '배드민턴', 8, 8),
        new ActivityDto(2, '배구', 18, 12),
      ]);
    });
  });
});
