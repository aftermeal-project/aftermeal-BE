import { MemberType } from '../domain/member-type';

export class SignUpDto {
  private readonly _name: string;
  private readonly _email: string;
  private readonly _memberType: MemberType;
  private readonly _generationNumber: number;

  constructor(
    name: string,
    email: string,
    memberType: MemberType,
    generationNumber?: number,
  ) {
    this._name = name;
    this._memberType = memberType;
    this._email = email;
    this._generationNumber = generationNumber;
  }

  get name(): string {
    return this._name;
  }
  get memberType(): MemberType {
    return this._memberType;
  }

  get email(): string {
    return this._email;
  }

  get generationNumber(): number {
    return this._generationNumber;
  }
}
