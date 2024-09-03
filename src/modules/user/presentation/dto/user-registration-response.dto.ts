import { Exclude, Expose } from 'class-transformer';
import { User } from '../../domain/entities/user.entity';

export class UserRegistrationResponseDto {
  @Exclude() private readonly _id: number;

  constructor(id: number) {
    this._id = id;
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  static from(user: User): UserRegistrationResponseDto {
    return new UserRegistrationResponseDto(user.id);
  }
}
