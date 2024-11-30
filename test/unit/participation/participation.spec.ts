import { Activity } from '../../../src/modules/activity/domain/entities/activity.entity';
import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { Participation } from '../../../src/modules/participation/domain/entities/participation.entity';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { Role } from '../../../src/modules/role/domain/entities/role.entity';
import { EActivityType } from '../../../src/modules/activity/domain/entities/activity-type';
import { ActivityLocation } from '../../../src/modules/activity-location/domain/entities/activity-location.entity';

describe('Participation', () => {
  describe('create', () => {
    it('참가를 생성한다.', () => {
      // given
      const activity: Activity = createActivity();
      const user: User = createUser();

      const currentDateTime: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(11, 30),
        ZoneOffset.UTC,
      );

      // when
      const participation: Participation = Participation.create(
        activity,
        user,
        currentDateTime,
      );

      // then
      expect(participation.activity).toEqual(activity);
      expect(participation.user).toEqual(user);
    });

    it('이미 참가한 활동일 경우 예외를 발생시킨다.', () => {
      // given
      const activity: Activity = createActivity();
      const user: User = createUser();

      const currentDateTime: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(11, 30),
        ZoneOffset.UTC,
      );

      const participation: Participation = Participation.create(
        activity,
        user,
        currentDateTime,
      );
      activity.participations.push(participation);

      // when
      const result = () =>
        Participation.create(activity, user, currentDateTime);

      // then
      expect(result).toThrowError(AlreadyExistException);
    });

    it('참가 인원이 꽉 찼을 경우 예외를 발생시킨다.', () => {
      // given
      const activity: Activity = createActivity();
      activity.maxParticipants = 0; // // 참가 인원이 꽉 찼을 경우를 테스트하기 위해 참가 인원을 0으로 설정

      const user: User = createUser();

      const currentDateTime: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(11, 30),
        ZoneOffset.UTC,
      );

      // when
      const result = () =>
        Participation.create(activity, user, currentDateTime);

      // then
      expect(result).toThrowError(IllegalStateException);
    });

    it('참가 신청 기간이 아닐 경우 예외를 발생시킨다.', () => {
      // given
      const activity: Activity = createActivity();
      const user: User = createUser();

      const currentDateTime: ZonedDateTime = ZonedDateTime.of(
        LocalDate.of(2024, 1, 1),
        LocalTime.of(0, 0),
        ZoneOffset.UTC,
      );

      // when
      const result = () =>
        Participation.create(activity, user, currentDateTime);

      // then
      expect(result).toThrowError(IllegalStateException);
    });
  });
});

function createActivity(): Activity {
  const currentDateTime: ZonedDateTime = ZonedDateTime.of(
    LocalDate.of(2024, 1, 1),
    LocalTime.of(11, 0),
    ZoneOffset.UTC,
  );

  const activity: Activity = Activity.create(
    'title',
    10,
    new ActivityLocation(),
    EActivityType.LUNCH,
    LocalDate.of(2024, 1, 1),
    currentDateTime,
  );
  activity.participations = []; // initializers

  return activity;
}

function createUser(): User {
  return User.createTeacher(
    '송유현',
    'test@example.com',
    Role.create('USER'),
    'G$K9Vss9-wNX6jOvY',
  );
}
