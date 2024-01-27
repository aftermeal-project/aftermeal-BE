import { Exclude, Expose } from 'class-transformer';

export class SignUpResponseDto {
  @Exclude() private readonly _id: number;

  constructor(id: number) {
    this._id = id;
  }

  @Expose()
  get id(): number {
    return this._id;
  }
}
