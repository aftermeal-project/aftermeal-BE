import { ActivityLocationRepository } from '../../src/modules/activity-location/domain/repositories/activity-location.repository';
import { DataSource } from 'typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ACTIVITY_LOCATION_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityLocationService } from '../../src/modules/activity-location/application/activity-location.service';
import { ActivityLocation } from '../../src/modules/activity-location/domain/entities/activity-location.entity';
import { ActivityLocationUpdateRequestDto } from '../../src/modules/activity-location/presentation/dto/activity-location-update-request.dto';
import { ActivityLocationCreationRequestDto } from '../../src/modules/activity-location/presentation/dto/activity-location-creation-request.dto';
import { ActivityLocationCreationResponseDto } from '../../src/modules/activity-location/presentation/dto/activity-location-creation-response.dto';
import { ActivityLocationModule } from '../../src/modules/activity-location/activity-location.module';
import { ActivityLocationResponseDto } from '../../src/modules/activity-location/presentation/dto/activity-location-response.dto';

describe('ActivityLocationService', () => {
  let activityLocationService: ActivityLocationService;
  let activityLocationRepository: ActivityLocationRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [getTestMysqlModule(), ActivityLocationModule],
    }).compile();

    activityLocationService = moduleRef.get<ActivityLocationService>(
      ActivityLocationService,
    );
    activityLocationRepository = moduleRef.get<ActivityLocationRepository>(
      ACTIVITY_LOCATION_REPOSITORY,
    );
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await activityLocationRepository.deleteAll();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('createActivityLocation', () => {
    it('활동 장소를 생성한다.', async () => {
      // given
      const dto: ActivityLocationCreationRequestDto = {
        name: 'GYM',
      };

      // when
      const result: ActivityLocationCreationResponseDto =
        await activityLocationService.createActivityLocation(dto);

      // then
      const activityLocation: ActivityLocation =
        await activityLocationRepository.findOneById(result.id);

      expect(activityLocation.id).toEqual(result.id);
    });
  });

  describe('getActivityLocationById', () => {
    it('ID를 통해 활동 장소를 가져온다.', async () => {
      // given
      const dto: ActivityLocationCreationRequestDto = {
        name: 'GYM',
      };

      const responseDto: ActivityLocationCreationResponseDto =
        await activityLocationService.createActivityLocation(dto);

      // when
      const activityLocation: ActivityLocation =
        await activityLocationService.getActivityLocationById(responseDto.id);

      // then
      expect(activityLocation.id).toEqual(responseDto.id);
    });

    it('ID가 존재하지 않는 경우 예외를 반환한다.', async () => {
      // when & then
      await expect(
        activityLocationService.getActivityLocationById(9999999999),
      ).rejects.toThrow();
    });
  });

  describe('getActivityLocations', () => {
    it('활동 장소 목록을 가져온다.', async () => {
      // given
      const dto1: ActivityLocationCreationRequestDto = {
        name: 'GYM',
      };
      const dto2: ActivityLocationCreationRequestDto = {
        name: 'GROUND',
      };

      const responseDto1: ActivityLocationCreationResponseDto =
        await activityLocationService.createActivityLocation(dto1);
      const responseDto2: ActivityLocationCreationResponseDto =
        await activityLocationService.createActivityLocation(dto2);

      // when
      const foundActivityLocations: ActivityLocationResponseDto[] =
        await activityLocationService.getActivityLocations();

      // then
      expect(foundActivityLocations.length).toEqual(2);
      expect(foundActivityLocations[0].id).toEqual(responseDto1.id);
      expect(foundActivityLocations[0].name).toEqual('GYM');
      expect(foundActivityLocations[1].id).toEqual(responseDto2.id);
      expect(foundActivityLocations[1].name).toEqual('GROUND');
    });
  });

  describe('updateActivityLocation', () => {
    it('활동 장소를 업데이트한다.', async () => {
      // given
      const creationRequestDto: ActivityLocationCreationRequestDto = {
        name: 'GYM',
      };

      const result: ActivityLocationCreationResponseDto =
        await activityLocationService.createActivityLocation(
          creationRequestDto,
        );

      const updateRequestDto: ActivityLocationUpdateRequestDto = {
        name: 'GROUND',
      };

      // when
      await activityLocationService.updateActivityLocation(
        result.id,
        updateRequestDto,
      );

      // then
      const updatedActivityLocation =
        await activityLocationService.getActivityLocationById(result.id);

      expect(updatedActivityLocation.name).toEqual('GROUND');
    });

    it('존재하지 않는 활동 장소를 업데이트하려고 하면 예외를 반환한다.', async () => {
      // given
      const dto: ActivityLocationUpdateRequestDto = {
        name: 'GROUND',
      };

      // when & then
      await expect(
        activityLocationService.updateActivityLocation(9999999999, dto),
      ).rejects.toThrow();
    });
  });

  describe('deleteActivityLocation', () => {
    it('활동 장소를 삭제한다.', async () => {
      // given
      const dto: ActivityLocationCreationRequestDto = {
        name: 'GYM',
      };

      const result: ActivityLocationCreationResponseDto =
        await activityLocationService.createActivityLocation(dto);

      // when
      await activityLocationService.deleteActivityLocation(result.id);

      // then
      await expect(
        activityLocationService.getActivityLocationById(result.id),
      ).rejects.toThrow();
    });

    it('존재하지 않는 활동 장소를 삭제하려고 하면 예외를 반환한다.', async () => {
      // when & then
      await expect(
        activityLocationService.deleteActivityLocation(9999999999),
      ).rejects.toThrow();
    });
  });
});
