import { Enum, EnumType } from 'ts-jenum';

@Enum('_code')
export class ESchool extends EnumType<ESchool>() {
  static readonly GSM: ESchool = new ESchool(
    'GSM',
    '광주 소프트웨어 마이스터 고등학교',
    new RegExp('s[0-9]{5}@gsm\\.hs\\.kr'),
  );

  private constructor(
    readonly _code: string,
    readonly _name: string,
    readonly _emailFormat: RegExp,
  ) {
    super();
  }

  get emailFormat(): RegExp {
    return this._emailFormat;
  }
}
