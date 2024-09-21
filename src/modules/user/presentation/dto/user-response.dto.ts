import { UserType } from '../../domain/types/user-type';
import { UserStatus } from '../../domain/types/user-status';
import { User } from '../../domain/entities/user.entity';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _status: UserStatus;
  @Exclude() private readonly _type: UserType;
  @Exclude() private readonly _generationNumber: number;
  @Exclude() private readonly _roles: string[];

  constructor(
    id: number,
    name: string,
    email: string,
    status: UserStatus,
    type: UserType,
    generationNumber: number,
    roles: string[],
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._status = status;
    this._type = type;
    this._generationNumber = generationNumber;
    this._roles = roles;
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
  get status(): UserStatus {
    return this._status;
  }

  @Expose()
  get type(): UserType {
    return this._type;
  }

  @Expose()
  get generationNumber(): number {
    return this._generationNumber;
  }

  @Expose()
  get roles(): string[] {
    return this._roles;
  }

  static from(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.name,
      user.email,
      user.status,
      user.type,
      user?.generation?.generationNumber,
      user.roles.map((userRole) => userRole.role.name),
    );
  }
}
