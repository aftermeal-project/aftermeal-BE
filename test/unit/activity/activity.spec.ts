import { Activity } from '../../../src/modules/activity/domain/entities/activity.entity';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { EActivityType } from '../../../src/modules/activity/domain/entities/activity-type';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';

describe('Activity', () => {
  describe('create', () => {
    it('활동 예정 날짜는 과거로 설정할 수 없다.', () => {
      // given
      const scheduledDate: LocalDate = LocalDate.of(2024, 10, 29);
      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 10, 30),
        LocalTime.of(0, 0),
        ZoneOffset.UTC,
      );

      // when
      const result = () =>
        Activity.create(
          'title',
          10,
          new ActivityLocation(),
          EActivityType.LUNCH,
          scheduledDate,
          now,
        );

      // then
      expect(result).toThrowError(IllegalArgumentException);
    });

    it('활동 시작 시간 이후엔 활동을 생성할 수 없다.', () => {
      // given
      const scheduledDate: LocalDate = LocalDate.of(2024, 10, 30);
      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 10, 30),
        LocalTime.of(12, 31),
        ZoneOffset.UTC,
      );

      // when
      const result = () =>
        Activity.create(
          'title',
          10,
          new ActivityLocation(),
          EActivityType.LUNCH,
          scheduledDate,
          now,
        );

      // then
      expect(result).toThrowError(IllegalStateException);
    });
  });
});
