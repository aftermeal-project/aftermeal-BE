import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class StudentEntity extends EnumType<StudentEntity>() {
  static readonly STUDENT = new StudentEntity('STUDENT', '재학생');
  static readonly GRADUATE = new StudentEntity('GRADUATE', '졸업생');
  static readonly ADMIN = new StudentEntity('ADMIN', '관리자');
  static readonly NONE = new StudentEntity('NONE', 'NONE');

  private constructor(readonly _code: string, readonly _name: string) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  static findNameByCode(code: string): string {
    return this.values().find((e) => e.equals(code))?.name;
  }

  static findByGeneration(generation: number) {
    const year: number = new Date().getUTCFullYear();
    return this.values().find((e) => e.)?.name;
  }

  betweenYear(year: number): boolean {
    const currentYear = new Date().getUTCFullYear();
    return this.startYear <= year && this.cu >= year;
  }

  private equals(code: string): boolean {
    return this.code === code;
  }
}
