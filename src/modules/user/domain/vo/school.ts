import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class School extends EnumType<School>() {
  static readonly GSM = new School(
    'GSM',
    '광주 소프트웨어 마이스터 고등학교',
    new RegExp('s[0-9]{5}@gsm\\.hs\\.kr'),
  );

  private constructor(
    readonly _code: string,
    readonly _name: string,
    readonly _regExp: RegExp,
  ) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get regExp(): RegExp {
    return this._regExp;
  }

  static findByCode(code: string) {
    return this.values().find((element) => element.equals(code));
  }

  equals(code: string): boolean {
    return this.code === code;
  }
}
