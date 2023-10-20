import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class TimeZone extends EnumType<TimeZone>() {
  static readonly LUNCH: TimeZone = new TimeZone('LUNCH', '점심');
  static readonly DINNER: TimeZone = new TimeZone('DINNER', '저녁');

  private constructor(readonly _code: string, readonly _name: string) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  equals(code: string): boolean {
    return this.code === code;
  }
}
