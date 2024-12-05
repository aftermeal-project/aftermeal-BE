import { UserType } from '../../domain/entities/user-type';
import { UserStatus } from '../../domain/entities/user-status';
import { User } from '../../domain/entities/user.entity';
import { Exclude, Expose } from 'class-transformer';
import { Generation } from '../../../generation/domain/entities/generation.entity';
import { Role } from '../../domain/entities/role';

export class UserResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _status: UserStatus;
  @Exclude() private readonly _type: UserType;
  @Exclude() private readonly _generation: Generation | null;
  @Exclude() private readonly _role: Role;

  constructor(
    id: number,
    name: string,
    email: string,
    status: UserStatus,
    type: UserType,
    generation: Generation | null,
    role: Role,
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._status = status;
    this._type = type;
    this._generation = generation;
    this._role = role;
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
  get generationNumber(): number | null {
    if (!this._generation) {
      return null;
    }
    return this._generation.generationNumber;
  }

  @Expose()
  get role(): Role {
    return this._role;
  }

  static from(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.name,
      user.email,
      user.status,
      user.type,
      user.generation,
      user.role,
    );
  }
}
