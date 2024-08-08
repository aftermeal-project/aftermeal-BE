import { Exclude, Expose } from 'class-transformer';
import { Activity } from '../../domain/activity.entity';

export class ActivityInfoResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _maxParticipants: number;

  constructor(id: number, name: string, maxParticipants: number) {
    this._id = id;
    this._name = name;
    this._maxParticipants = maxParticipants;
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
  get maxParticipants(): number {
    return this._maxParticipants;
  }

  static from(activity: Activity): ActivityInfoResponseDto {
    return new ActivityInfoResponseDto(
      activity.id,
      activity.name,
      activity.maxParticipants,
    );
  }
}
