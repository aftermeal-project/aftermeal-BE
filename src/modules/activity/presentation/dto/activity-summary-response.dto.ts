import { Exclude, Expose } from 'class-transformer';
import { ActivitySummaryDto } from '../../infrastructure/dto/activity-summary.dto';

export class ActivitySummaryResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _maxParticipants: number;
  @Exclude() private readonly _currentParticipants: number;

  constructor(
    id: number,
    name: string,
    maxParticipants: number,
    currentParticipants: number,
  ) {
    this._id = id;
    this._name = name;
    this._maxParticipants = maxParticipants;
    this._currentParticipants = currentParticipants;
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

  @Expose()
  get currentParticipants(): number {
    return this._currentParticipants;
  }

  static from(activity: ActivitySummaryDto) {
    return new ActivitySummaryResponseDto(
      activity.id,
      activity.name,
      activity.maxParticipants,
      activity.currentParticipants,
    );
  }
}
