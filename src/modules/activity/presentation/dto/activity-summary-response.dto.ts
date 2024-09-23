import { Exclude, Expose } from 'class-transformer';
import { ActivitySummaryDto } from '../../infrastructure/dto/activity-summary.dto';
import { ActivityStatus } from '../../domain/types/activity-status';
import { LocalDate } from '@js-joda/core';

export class ActivitySummaryResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _location: string;
  @Exclude() private readonly _maxParticipants: number;
  @Exclude() private readonly _currentParticipants: number;
  @Exclude() private readonly _status: ActivityStatus;
  @Exclude() private readonly _type: string;
  @Exclude() private readonly _scheduledDate: LocalDate;

  constructor(
    id: number,
    title: string,
    location: string,
    maxParticipants: number,
    currentParticipants: number,
    status: ActivityStatus,
    type: string,
    scheduledDate: LocalDate,
  ) {
    this._id = id;
    this._title = title;
    this._location = location;
    this._maxParticipants = maxParticipants;
    this._currentParticipants = currentParticipants;
    this._status = status;
    this._type = type;
    this._scheduledDate = scheduledDate;
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get title(): string {
    return this._title;
  }

  @Expose()
  get location(): string {
    return this._location;
  }

  @Expose()
  get maxParticipants(): number {
    return this._maxParticipants;
  }

  @Expose()
  get currentParticipants(): number {
    return this._currentParticipants;
  }

  @Expose()
  get status(): string {
    return this._status;
  }

  @Expose()
  get type(): string {
    return this._type;
  }

  @Expose()
  get scheduledDate(): string {
    return this._scheduledDate.toString();
  }

  static from(activity: ActivitySummaryDto) {
    return new ActivitySummaryResponseDto(
      activity.id,
      activity.title,
      activity.location,
      activity.maxParticipants,
      activity.currentParticipants,
      activity.status,
      activity.type,
      activity.scheduledDate,
    );
  }
}
