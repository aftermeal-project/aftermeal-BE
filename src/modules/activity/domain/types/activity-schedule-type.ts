import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class EActivityScheduleType extends EnumType<EActivityScheduleType>() {
  static readonly LUNCH: EActivityScheduleType = new EActivityScheduleType(
    'LUNCH',
    '점심',
  );
  static readonly DINNER: EActivityScheduleType = new EActivityScheduleType(
    'DINNER',
    '저녁',
  );

  constructor(
    readonly _code: string,
    readonly _name: string,
  ) {
    super();
  }

  get code(): string {
    return this._code;
  }
}
