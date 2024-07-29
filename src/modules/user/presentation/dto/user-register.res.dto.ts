import { Exclude, Expose } from 'class-transformer';
import { User } from '../../domain/user.entity';

export class UserRegisterResDto {
  @Exclude() private readonly _id: number;

  constructor(id: number) {
    this._id = id;
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  static from(user: User): UserRegisterResDto {
    return new UserRegisterResDto(user.id);
  }
}
