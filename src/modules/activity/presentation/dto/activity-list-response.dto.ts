import { Exclude, Expose } from 'class-transformer';
import { LocalDate, ZonedDateTime } from '@js-joda/core';
import { EActivityType } from '../../domain/types/activity-type';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';
import { Activity } from '../../domain/entities/activity.entity';

export class ActivityListResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _location: ActivityLocation;
  @Exclude() private readonly _maxParticipants: number;
  @Exclude() private readonly _currentParticipants: number;
  @Exclude() private readonly _type: EActivityType;
  @Exclude() private readonly _scheduledDate: LocalDate;
  @Exclude() private readonly _applicationStartAt: ZonedDateTime;
  @Exclude() private readonly _applicationEndAt: ZonedDateTime;

  constructor(
    id: number,
    title: string,
    location: ActivityLocation,
    maxParticipants: number,
    currentParticipants: number,
    type: EActivityType,
    scheduledDate: LocalDate,
    applicationStartAt: ZonedDateTime,
    applicationEndAt: ZonedDateTime,
  ) {
    this._id = id;
    this._title = title;
    this._location = location;
    this._maxParticipants = maxParticipants;
    this._currentParticipants = currentParticipants;
    this._type = type;
    this._scheduledDate = scheduledDate;
    this._applicationStartAt = applicationStartAt;
    this._applicationEndAt = applicationEndAt;
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
    return this._location.name;
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
  get type(): string {
    return this._type.code;
  }

  @Expose()
  get scheduledDate(): string {
    return this._scheduledDate.toString();
  }

  @Expose()
  get applicationStartAt(): string {
    return this._applicationStartAt.toString();
  }

  @Expose()
  get applicationEndAt(): string {
    return this._applicationEndAt.toString();
  }

  static from(activity: Activity) {
    return new ActivityListResponseDto(
      activity.id,
      activity.title,
      activity.location,
      activity.maxParticipants,
      activity.participations.length,
      activity.type,
      activity.scheduledDate,
      activity.applicationStartAt,
      activity.applicationEndAt,
    );
  }
}
