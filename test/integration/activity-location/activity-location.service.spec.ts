import { ActivityLocationRepository } from '../../../src/modules/activity-location/domain/repositories/activity-location.repository';
import { DataSource } from 'typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { ACTIVITY_LOCATION_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityLocationService } from '../../../src/modules/activity-location/application/services/activity-location.service';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { ActivityLocationUpdateRequestDto } from '../../../src/modules/activity-location/presentation/dto/activity-location-update-request.dto';
import { ActivityLocationCreationRequestDto } from '../../../src/modules/activity-location/presentation/dto/activity-location-creation-request.dto';
import { ActivityLocationModule } from '../../../src/modules/activity-location/activity-location.module';
import { ActivityLocationResponseDto } from '../../../src/modules/activity-location/presentation/dto/activity-location-response.dto';

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
      await activityLocationService.createActivityLocation(dto);

      // then
      const activityLocations: ActivityLocation[] =
        await activityLocationRepository.find();

      expect(activityLocations.length).toEqual(1);
    });
  });

  describe('getActivityLocationById', () => {
    it('ID를 통해 활동 장소를 가져온다.', async () => {
      // given
      const savedActivityLocation: ActivityLocation =
        ActivityLocation.create('GYM');
      await activityLocationRepository.save(savedActivityLocation);

      // when
      const activityLocation: ActivityLocation =
        await activityLocationService.getActivityLocationById(
          savedActivityLocation.id,
        );

      // then
      expect(activityLocation.id).toEqual(savedActivityLocation.id);
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
      const activityLocation1: ActivityLocation =
        ActivityLocation.create('GYM');
      const activityLocation2: ActivityLocation =
        ActivityLocation.create('GROUND');

      await activityLocationRepository.save(activityLocation1);
      await activityLocationRepository.save(activityLocation2);

      // when
      const responseDtos: ActivityLocationResponseDto[] =
        await activityLocationService.getActivityLocations();

      // then
      expect(responseDtos.length).toEqual(2);
      expect(responseDtos[0].id).toEqual(activityLocation1.id);
      expect(responseDtos[1].id).toEqual(activityLocation2.id);
    });
  });

  describe('updateActivityLocation', () => {
    it('활동 장소를 업데이트한다.', async () => {
      // given
      const activityLocation: ActivityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      const updateDto: ActivityLocationUpdateRequestDto = {
        name: 'GROUND',
      };

      // when
      await activityLocationService.updateActivityLocation(
        activityLocation.id,
        updateDto,
      );

      // then
      const updatedActivityLocation =
        await activityLocationService.getActivityLocationById(
          activityLocation.id,
        );

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
      const activityLocation: ActivityLocation = ActivityLocation.create('GYM');
      await activityLocationRepository.save(activityLocation);

      // when
      await activityLocationService.deleteActivityLocation(activityLocation.id);

      // then
      const activityLocations: ActivityLocation[] =
        await activityLocationRepository.find();

      expect(activityLocations.length).toEqual(0);
    });

    it('존재하지 않는 활동 장소를 삭제하려고 하면 예외를 반환한다.', async () => {
      // when & then
      await expect(
        activityLocationService.deleteActivityLocation(9999999999),
      ).rejects.toThrow();
    });
  });
});
