import { Enum, EnumType } from 'ts-jenum';

@Enum('_name')
export class EUserType extends EnumType<EUserType>() {
  static readonly STUDENT: EUserType = new EUserType('학생');
  static readonly TEACHER: EUserType = new EUserType('선생님');

  private constructor(readonly _name: string) {
    super();
  }

  get name(): string {
    return this._name;
  }

  static mappingEnum() {
    return this.values().reduce((obj, item) => {
      obj[item.enumName] = item.name;
      return obj;
    }, {});
  }
}
