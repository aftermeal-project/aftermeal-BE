import { Activity } from '../../domain/entities/activity.entity';
import { Exclude, Expose } from 'class-transformer';
import { Participation } from '../../../participation/domain/entities/participation.entity';
import { LocalDate, ZonedDateTime } from '@js-joda/core';
import { UserType } from '../../../user/domain/types/user-type';
import { EActivityType } from '../../domain/types/activity-type';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';

export class ActivityDetailResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _maxParticipants: number;
  @Exclude() private readonly _location: ActivityLocation;
  @Exclude() private readonly _type: EActivityType;
  @Exclude() private readonly _scheduledDate: LocalDate;
  @Exclude() private readonly _applicationStartAt: ZonedDateTime;
  @Exclude() private readonly _applicationEndAt: ZonedDateTime;
  @Exclude() private readonly _participations: Participation[];

  constructor(
    id: number,
    title: string,
    maxParticipants: number,
    location: ActivityLocation,
    type: EActivityType,
    scheduledDate: LocalDate,
    applicationStartAt: ZonedDateTime,
    applicationEndAt: ZonedDateTime,
    participations: Participation[],
  ) {
    this._id = id;
    this._title = title;
    this._maxParticipants = maxParticipants;
    this._location = location;
    this._type = type;
    this._scheduledDate = scheduledDate;
    this._applicationStartAt = applicationStartAt;
    this._applicationEndAt = applicationEndAt;
    this._participations = participations;
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
  get maxParticipants(): number {
    return this._maxParticipants;
  }

  @Expose()
  get currentParticipants(): number {
    return this._participations.length;
  }

  @Expose()
  get location(): string {
    return this._location.name;
  }

  @Expose()
  get type(): string {
    return this._type.enumName;
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

  @Expose()
  get participations(): {
    id: number;
    user: {
      id: number;
      name: string;
      type: UserType;
      generationNumber: number | null;
    };
  }[] {
    return this._participations.map((participation) => {
      return {
        id: participation.id,
        user: {
          id: participation.user.id,
          name: participation.user.name,
          type: participation.user.type,
          generationNumber:
            participation.user.type === UserType.STUDENT
              ? participation.user.generation.generationNumber
              : null,
        },
      };
    });
  }

  static from(activity: Activity): ActivityDetailResponseDto {
    return new ActivityDetailResponseDto(
      activity.id,
      activity.title,
      activity.maxParticipants,
      activity.location,
      activity.type,
      activity.scheduledDate,
      activity.applicationStartAt,
      activity.applicationEndAt,
      activity.participations,
    );
  }
}
