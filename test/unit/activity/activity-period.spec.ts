import { ApplicationPeriod } from '../../../src/modules/activity/domain/vo/application-period';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';

describe('ActivityPeriod', () => {
  describe('isWithinApplicationPeriod', () => {
    it('신청 기간 내에 있는 경우 true를 반환한다.', () => {
      // given
      const applicationStartAt: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(8, 30, 0),
        ZoneOffset.UTC,
      );
      const applicationEndAt: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(12, 30, 0),
        ZoneOffset.UTC,
      );

      const applicationPeriod: ApplicationPeriod = ApplicationPeriod.create(
        applicationStartAt,
        applicationEndAt,
      );

      const applicationAt: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(8, 30, 0),
        ZoneOffset.UTC,
      );

      // when
      const result = applicationPeriod.isWithinApplicationPeriod(applicationAt);

      // then
      expect(result).toBe(true);
    });

    it('신청 기간 내에 없는 경우 false를 반환한다.', () => {
      // given
      const applicationPeriod: ApplicationPeriod = ApplicationPeriod.create(
        ZonedDateTime.of(
          LocalDate.of(2024, 1, 1),
          LocalTime.of(8, 30, 0),
          ZoneOffset.UTC,
        ),
        ZonedDateTime.of(
          LocalDate.of(2024, 1, 1),
          LocalTime.of(12, 30, 0),
          ZoneOffset.UTC,
        ),
      );

      // when
      const result = applicationPeriod.isWithinApplicationPeriod(
        ZonedDateTime.of(
          LocalDate.of(2024, 1, 1),
          LocalTime.of(8, 29, 59),
          ZoneOffset.UTC,
        ),
      );

      // then
      expect(result).toBe(false);
    });
  });
});
