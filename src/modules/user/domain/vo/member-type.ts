// import { Enum, EnumType } from 'ts-jenum';
// import { BadRequestException } from '@nestjs/common';
//
// @Enum('code')
// export class MemberType extends EnumType<MemberType>() {
//   static readonly STUDENT: MemberType = new MemberType(1, '학생');
//   static readonly TEACHER: MemberType = new MemberType(2, '선생님');
//
//   private constructor(readonly _code: number, readonly _name: string) {
//     super();
//   }
//
//   get code(): number {
//     return this._code;
//   }
//
//   get name(): string {
//     return this._name;
//   }
//
//   static findByCode(code: number): MemberType {
//     return this.values().find((element) => element.equals(code));
//   }
//
//   equals(code: number): boolean {
//     return this.code === code;
//   }
//
//   static valueByName(name: string): MemberType {
//     const value: MemberType = this.values().find(
//       (element) => element.enumName === name,
//     );
//     if (!value) {
//       throw new BadRequestException(
//         `The element with ${name} name does not exist in the ${this.__store__.name} enumeration`,
//       );
//     }
//     return value;
//   }
// }

export enum MemberType {
  'STUDENT' = '학생',
  'TEACHER' = '선생님',
}
