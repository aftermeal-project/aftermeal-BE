import { MemberType } from '../../user/domain/member-type';

export class InviteMember {
  private readonly _email: string[];
  private readonly _memberType: MemberType;
  private readonly _generationNumber?: number | null;

  constructor(
    email: string[],
    memberType: MemberType,
    generationNumber?: number,
  ) {
    this._email = email;
    this._memberType = memberType;
    this._generationNumber = generationNumber;
  }

  get email(): string[] {
    return this._email;
  }

  get memberType(): MemberType {
    return this._memberType;
  }

  get generationNumber(): number | null {
    return this._generationNumber;
  }
}
