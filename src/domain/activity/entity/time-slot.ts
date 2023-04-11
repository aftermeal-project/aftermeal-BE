import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
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

  static now(): TimeSlot {
    const today: Date = new Date();
    const currentHour: number = today.getHours();
    const currentMinute: number = today.getMinutes();
    return currentHour < 13 || (currentHour === 13 && currentMinute < 30)
      ? this.DAY
      : this.NIGHT;
  }

  equals(code: string): boolean {
    return this.code === code;
  }
}
