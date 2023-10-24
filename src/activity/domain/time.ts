import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class Time extends EnumType<Time>() {
  static readonly LUNCH: Time = new Time('LUNCH', '점심');
  static readonly DINNER: Time = new Time('DINNER', '저녁');

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
