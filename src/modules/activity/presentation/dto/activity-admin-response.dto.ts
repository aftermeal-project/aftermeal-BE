import { Activity } from '../../domain/entities/activity.entity';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../../user/domain/entities/user.entity';
import { Participation } from '../../../participation/domain/entities/participation.entity';

export class ActivityAdminResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _maxParticipants: number;
  @Exclude() private readonly _participants: User[];

  constructor(
    id: number,
    title: string,
    maxParticipants: number,
    participants: User[],
  ) {
    this._id = id;
    this._title = title;
    this._maxParticipants = maxParticipants;
    this._participants = participants;
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
  get participants(): User[] {
    return this._participants;
  }

  static from(
    activity: Activity,
    participations: Participation[],
  ): ActivityAdminResponseDto {
    return new ActivityAdminResponseDto(
      activity.id,
      activity.title,
      activity.maxParticipants,
      participations.map((participation) => participation.user),
    );
  }
}
