import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _type: string;
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _generationNumber: number | null;
  @Exclude() private readonly _role: string[];
  @Exclude() private readonly _enabled: boolean;

  constructor(
    id: number,
    name: string,
    type: string,
    email: string,
    generationNumber: number | null,
    role: string[],
    enabled: boolean,
  ) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._email = email;
    this._generationNumber = generationNumber;
    this._role = role;
    this._enabled = enabled;
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  @Expose()
  get email(): string {
    return this._email;
  }

  @Expose()
  get generationNumber(): number {
    return this._generationNumber;
  }

  @Expose()
  get role(): string[] {
    return this._role;
  }

  @Expose()
  get type(): string {
    return this._type;
  }
}
