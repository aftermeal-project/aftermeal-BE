import { Enum, EnumType } from 'ts-jenum';
import { LocalTime } from '@js-joda/core';

@Enum('code')
export class EActivityType extends EnumType<EActivityType>() {
  static readonly LUNCH: EActivityType = new EActivityType(
    'LUNCH',
    '점심',
    LocalTime.of(12, 30),
    LocalTime.of(1, 30),
  );
  static readonly DINNER: EActivityType = new EActivityType(
    'DINNER',
    '저녁',
    LocalTime.of(6, 30),
    LocalTime.of(7, 30),
  );

  constructor(
    readonly _code: string,
    readonly _name: string,
    readonly _startAt: LocalTime,
    readonly _endAt: LocalTime,
  ) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  static codes(): string[] {
    return this.values().map((color) => color.code);
  }
}
