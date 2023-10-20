import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class ActivityStatus extends EnumType<ActivityStatus>() {
  static readonly VOTING: ActivityStatus = new ActivityStatus('VOTING', '종목 투표중');
  static readonly APPLYING: ActivityStatus = new ActivityStatus('APPLYING', '종목 참가신청 중');
  static readonly IN_PROGRESS: ActivityStatus = new ActivityStatus('IN_PROGRESS', '종목 진행중');
  static readonly NONE: ActivityStatus = new ActivityStatus('NONE', 'NONE');

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
    return this.values().find((activityStatus) => activityStatus.equals(code))?.name;
  }

  equals(code: string): boolean {
    return this.code === code;
  }
}
