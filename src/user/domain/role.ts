import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class Role extends EnumType<Role>() {
  static readonly Member: Role = new Role('MEMBER', '구성원');
  static readonly Guest: Role = new Role('GUEST', '손님');
  static readonly Manager: Role = new Role('MANAGER', '매니저');
  static readonly Admin: Role = new Role('ADMIN', '전역 관리자');

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
   * 전체 Role 중 해당 code와 일치하는 Role 탐색
   * @returns - 일치하는 Role의 name
   */
  static findName(code: string): string {
    return this.values().find((e) => e.equals(code))?.name;
  }

  equals(code: string): boolean {
    return this._code === code;
  }
}
