import { EUserType } from '../../user/domain/user-type';

export class InviteMember {
  private readonly _email: string[];
  private readonly _memberType: EUserType;
  private readonly _generationNumber?: number | null;

  constructor(
    email: string[],
    memberType: EUserType,
    generationNumber?: number,
  ) {
    this._email = email;
    this._memberType = memberType;
    this._generationNumber = generationNumber;
  }

  get email(): string[] {
    return this._email;
  }

  get memberType(): EUserType {
    return this._memberType;
  }

  get generationNumber(): number | null {
    return this._generationNumber;
  }
}
