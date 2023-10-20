import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class UserStatus extends EnumType<UserStatus>() {
  static readonly Activate = new UserStatus('ACTIVATED', '활성화');
  static readonly Deactivate = new UserStatus('DEACTIVATE', '비활성화');
  static readonly Candidate = new UserStatus('CANDIDATE', '임시 가입');

  private constructor(readonly _code: string, readonly _name: string) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  /**
   * 전체 UserStatus 중 해당 code와 일치하는 UserStatus 탐색
   * @returns - 일치하는 name을 반환
   */
  static findName(code: string): string {
    return this.values().find((e) => e.equals(code))?.name;
  }

  equals(code: string): boolean {
    return this._code === code;
  }
}
