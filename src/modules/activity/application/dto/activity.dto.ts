import { Exclude, Expose } from 'class-transformer';

export class ActivityDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _maximumParticipants: number;
  @Exclude() private readonly _participantsCount: number;

  constructor(
    id: number,
    name: string,
    maximumParticipants: number,
    participantsCount: number,
  ) {
    this._id = id;
    this._name = name;
    this._maximumParticipants = maximumParticipants;
    this._participantsCount = participantsCount;
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
  get maximumParticipants(): number {
    return this._maximumParticipants;
  }

  @Expose()
  get participantsCount(): number {
    return this._participantsCount;
  }
}
