import { Enum, EnumType } from 'ts-jenum';
import { LocalTime } from '@js-joda/core';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';

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
    private readonly _name: string,
    private readonly _startAt: LocalTime,
    private readonly _endAt: LocalTime,
  ) {
    super();
    if (_endAt.isBefore(_startAt)) {
      throw new IllegalArgumentException(
        '종료 시간은 시작 시간 이후여야 합니다',
      );
    }
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get startAt(): LocalTime {
    return this._startAt;
  }

  get endAt(): LocalTime {
    return this._endAt;
  }

  isBeforeStartAt(time: LocalTime): boolean {
    return time.isBefore(this._startAt);
  }
}
