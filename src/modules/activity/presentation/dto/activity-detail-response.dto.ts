import { Activity } from '../../domain/entities/activity.entity';
import { Exclude, Expose } from 'class-transformer';
import { Participation } from '../../../participation/domain/entities/participation.entity';
import { LocalDate } from '@js-joda/core';
import { UserType } from '../../../user/domain/types/user-type';
import { EActivityType } from '../../domain/types/activity-type';

export class ActivityDetailResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _maxParticipants: number;
  @Exclude() private readonly _location: string;
  @Exclude() private readonly _type: EActivityType;
  @Exclude() private readonly _scheduledDate: LocalDate;
  @Exclude() private readonly _participations: Participation[];

  constructor(
    id: number,
    title: string,
    maxParticipants: number,
    location: string,
    type: EActivityType,
    scheduledDate: LocalDate,
    participations: Participation[],
  ) {
    this._id = id;
    this._title = title;
    this._maxParticipants = maxParticipants;
    this._location = location;
    this._type = type;
    this._scheduledDate = scheduledDate;
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
  get location(): string {
    return this._location;
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
  get participations(): {
    id: number;
    user: {
      id: number;
      name: string;
      type: UserType;
      generationNumber: number | null;
    };
  }[] {
    return this._participations.map((participant) => {
      return {
        id: participant.id,
        user: {
          id: participant.user.id,
          name: participant.user.name,
          type: participant.user.type,
          generationNumber: participant.user.generation.generationNumber,
        },
      };
    });
  }

  static from(
    activity: Activity,
    participations: Participation[],
  ): ActivityDetailResponseDto {
    return new ActivityDetailResponseDto(
      activity.id,
      activity.title,
      activity.maxParticipants,
      activity.location.name,
      activity.type,
      activity.scheduledDate,
      participations,
    );
  }
}
