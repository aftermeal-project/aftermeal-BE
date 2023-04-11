import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class Role extends EnumType<Role>() {
  static readonly STUDENT = new Role('STUDENT', '재학생');
  static readonly GRADUATE = new Role('GRADUATE', '졸업생');
  static readonly TEACHER = new Role('TEACHER', '선생님');
  static readonly ADMIN = new Role('ADMIN', '관리자');
  static readonly NONE = new Role('NONE', 'NONE');

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

  private equals(code: string): boolean {
    return this.code === code;
  }
}
