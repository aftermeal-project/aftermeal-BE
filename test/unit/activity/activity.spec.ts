import { Activity } from '../../../src/modules/activity/domain/entities/activity.entity';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';
import { EActivityType } from '../../../src/modules/activity/domain/entities/activity-type';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { Participation } from '../../../src/modules/participation/domain/entities/participation.entity';

describe('Activity', () => {
  describe('create', () => {
    it('활동 예정 날짜는 과거로 설정할 수 없다.', () => {
      // given
      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 10, 30),
        LocalTime.of(0, 0),
        ZoneOffset.UTC,
      );
      const scheduledDate: LocalDate = now.minusDays(1).toLocalDate();

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
      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 10, 30),
        LocalTime.of(12, 30, 1),
        ZoneOffset.UTC,
      );

      // when
      const result = () =>
        Activity.create(
          'title',
          10,
          new ActivityLocation(),
          EActivityType.LUNCH,
          LocalDate.of(2024, 10, 30),
          now,
        );

      // then
      expect(result).toThrowError(IllegalStateException);
    });
  });

  describe('isFull', () => {
    it('참가 인원이 꽉 찼을 때 true를 반환한다.', () => {
      // given
      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 10, 30),
        LocalTime.of(8, 30, 0),
        ZoneOffset.UTC,
      );
      const activity: Activity = Activity.create(
        'title',
        1,
        new ActivityLocation(),
        EActivityType.LUNCH,
        LocalDate.of(2024, 10, 30),
        now,
      );

      activity.participations = [new Participation()];

      // when
      const result = activity.isFull();

      // then
      expect(result).toBe(true);
    });

    it('참가 인원이 꽉 차지 않았을 때 false를 반환한다.', () => {
      // given
      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 10, 30),
        LocalTime.of(8, 30, 0),
        ZoneOffset.UTC,
      );
      const activity: Activity = Activity.create(
        'title',
        2,
        new ActivityLocation(),
        EActivityType.LUNCH,
        LocalDate.of(2024, 10, 30),
        now,
      );

      activity.participations = [new Participation()];

      // when
      const result = activity.isFull();

      // then
      expect(result).toBe(false);
    });
  });

  describe('hasParticipation', () => {
    it('해당 참가자가 참가한 사용자면 true를 반환한다.', () => {
      // given
      const now: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 10, 30),
        LocalTime.of(8, 30, 0),
        ZoneOffset.UTC,
      );
      const activity: Activity = Activity.create(
        'title',
        2,
        new ActivityLocation(),
        EActivityType.LUNCH,
        LocalDate.of(2024, 10, 30),
        now,
      );

      const user: User = new User();
      user.id = 1;

      const participation: Participation = new Participation();
      participation.user = user;

      activity.participations = [participation];

      // when
      const result = activity.hasParticipation(user);

      // then
      expect(result).toBe(true);
    });

    it('해당 참가자가 참가한 사용자가 아니면 false를 반환한다.', () => {
      // given
      const now = ZonedDateTime.of(
        LocalDate.of(2024, 10, 30),
        LocalTime.of(8, 30, 0),
        ZoneOffset.UTC,
      );
      const activity: Activity = Activity.create(
        'title',
        2,
        new ActivityLocation(),
        EActivityType.LUNCH,
        LocalDate.of(2024, 10, 30),
        now,
      );

      // when
      const result = activity.hasParticipation(new User());

      // then
      expect(result).toBe(false);
    });
  });
});
