import { Activity } from '../../../src/modules/activity/domain/entities/activity.entity';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { EActivityType } from '../../../src/modules/activity/domain/entities/activity-type';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';

describe('Activity', () => {
  describe('create', () => {
    it('활동을 생성한다.', () => {
      // given
      const activityLocation: ActivityLocation = new ActivityLocation();

      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(0, 0),
        ZoneOffset.UTC,
      );

      const scheduledDate: LocalDate = LocalDate.of(2024, 1, 1);

      // when
      const activity: Activity = Activity.create(
        'title',
        10,
        activityLocation,
        EActivityType.LUNCH,
        scheduledDate,
        now,
      );

      // then
      expect(activity.title).toEqual('title');
      expect(activity.maxParticipants).toEqual(10);
      expect(activity.location).toEqual(activityLocation);
      expect(activity.type).toEqual(EActivityType.LUNCH);
      expect(activity.scheduledDate).toEqual(scheduledDate);
      expect(activity.startAt).toEqual('');
    });

    it('과거 날짜로 생성할 수 없다.', () => {
      // given
      const activityLocation = new ActivityLocation();

      const pastDay: LocalDate = LocalDate.of(2024, 10, 1);
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
          activityLocation,
          EActivityType.LUNCH,
          pastDay,
          now,
        );

      // then
      expect(result).toThrowError(IllegalStateException);
    });

    it('당일 활동은 활동 시작 4시간 전까지만 생성할 수 있다.', () => {
      // given
      const activityLocation = new ActivityLocation();

      const today: LocalDate = LocalDate.of(2024, 10, 30);
      const now: ZonedDateTime = ZonedDateTime.of(
        today,
        LocalTime.of(11, 30),
        ZoneOffset.UTC,
      );

      // when
      const result = () =>
        Activity.create(
          'title',
          10,
          activityLocation,
          EActivityType.LUNCH,
          today,
          now,
        );

      // then
      expect(result).toThrowError(IllegalStateException);
    });
  });
});
