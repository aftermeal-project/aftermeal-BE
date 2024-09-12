import { Activity } from '../../domain/entities/activity.entity';
import { LocalDate } from '@js-joda/core';
import { User } from '../../../user/domain/entities/user.entity';

export class ActivityDetailResponseDto {
  private readonly _id: number;
  private readonly _title: string;
  private readonly _maxParticipants: number;
  private readonly _location: string;
  private readonly _type: string;
  private readonly _scheduledDate: LocalDate;
  private readonly _participants: User[];

  constructor(
    id: number,
    title: string,
    maxParticipants: number,
    location: string,
    type: string,
    scheduledDate: LocalDate,
    participants: User[],
  ) {
    this._id = id;
    this._title = title;
    this._maxParticipants = maxParticipants;
    this._location = location;
    this._type = type;
    this._scheduledDate = scheduledDate;
    this._participants = participants;
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get maxParticipants(): number {
    return this._maxParticipants;
  }

  get location(): string {
    return this._location;
  }

  get type(): string {
    return this._type;
  }

  get scheduledDate(): string {
    return this._scheduledDate.toString();
  }

  get participants(): { id: number; displayName: string }[] {
    return this._participants.map((participant) => {
      return {
        id: participant.id,
        displayName:
          participant.generation.generationNumber + '기 ' + participant.name,
      };
    });
  }

  static async from(activity: Activity): Promise<ActivityDetailResponseDto> {
    return new ActivityDetailResponseDto(
      activity.id,
      activity.title,
      activity.maxParticipants,
      activity.location.name,
      activity.type.enumName,
      activity.scheduledDate,
      (await activity.participations).map(
        (participation) => participation.user,
      ),
    );
  }
}
