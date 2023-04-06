import { Enum, EnumType } from 'ts-jenum';

@Enum('enum')
export class TimeSlot extends EnumType<TimeSlot>() {
  static readonly DAY = new TimeSlot('DAY', '점심');
  static readonly NIGHT = new TimeSlot('NIGHT', '저녁');
  static readonly NONE = new TimeSlot('NONE', 'NONE');

  private constructor(readonly _code: string, readonly _name: string) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  static findName(code: string): string {
    return this.values().find((e) => e.equals(code))?.name;
  }

  equals(code: string): boolean {
    return this.code === code;
  }
}
