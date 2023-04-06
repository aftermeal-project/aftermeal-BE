import { Enum, EnumType } from 'ts-jenum';

@Enum('enum')
export class Role extends EnumType<Role>() {
  static readonly GUEST = new Role('GUEST', '게스트');
  static readonly STUDENT = new Role('STUDENT', '재학생');
  static readonly GRADUATE = new Role('GRADUATE', '졸업생');
  static readonly ADMIN = new Role('ADMIN', '관리자');

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
