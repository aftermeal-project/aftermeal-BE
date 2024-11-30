import { Enum, EnumType } from 'ts-jenum';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';

@Enum('code')
export class EActivityType extends EnumType<EActivityType>() {
  static readonly LUNCH: EActivityType = new EActivityType(
    'LUNCH',
    '점심',
    LocalTime.of(12, 30),
    LocalTime.of(13, 30),
  );
  static readonly DINNER: EActivityType = new EActivityType(
    'DINNER',
    '저녁',
    LocalTime.of(18, 30),
    LocalTime.of(19, 30),
  );

  constructor(
    private readonly _code: string,
    private readonly _displayName: string,
    private readonly _activityStartTime: LocalTime,
    private readonly _activityEndTime: LocalTime,
  ) {
    super();
    if (_activityEndTime.isBefore(_activityStartTime)) {
      throw new Error('활동 종료 시간은 활동 시작 시간 이후여야 합니다');
    }
  }

  get code(): string {
    return this._code;
  }

  get displayName(): string {
    return this._displayName;
  }

  getActivityStartDateTime(date: LocalDate): ZonedDateTime {
    return date.atTime(this._activityStartTime).atZone(ZoneOffset.UTC);
  }

  getActivityEndDateTime(date: LocalDate): ZonedDateTime {
    return date.atTime(this._activityEndTime).atZone(ZoneOffset.UTC);
  }
}
