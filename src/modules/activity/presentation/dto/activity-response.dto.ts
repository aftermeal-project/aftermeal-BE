import { Exclude, Expose } from 'class-transformer';
import { ActivityDto } from '../../infrastructure/dto/activity.dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @Exclude() @ApiHideProperty() private readonly _id: number;
  @Exclude() @ApiHideProperty() private readonly _name: string;
  @Exclude() @ApiHideProperty() private readonly _maxParticipants: number;
  @Exclude() @ApiHideProperty() private readonly _currentParticipants: number;

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

  @Expose()
  @ApiProperty()
  get currentParticipants(): number {
    return this._currentParticipants;
  }

  static from(activity: ActivityDto) {
    return new ActivityResponseDto(
      activity.id,
      activity.name,
      activity.maxParticipants,
      activity.currentParticipants,
    );
  }
}
