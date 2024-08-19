import { Exclude, Expose } from 'class-transformer';
import { Activity } from '../../domain/activity.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ActivityInfoResponseDto {
  @Exclude() @ApiHideProperty() private readonly _id: number;
  @Exclude() @ApiHideProperty() private readonly _name: string;
  @Exclude() @ApiHideProperty() private readonly _maxParticipants: number;

  constructor(id: number, name: string, maxParticipants: number) {
    this._id = id;
    this._name = name;
    this._maxParticipants = maxParticipants;
  }

  @Expose()
  @ApiProperty()
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty()
  get name(): string {
    return this._name;
  }

  @Expose()
  @ApiProperty()
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
