import { Exclude, Expose } from 'class-transformer';
import { ActivityLocation } from '../../domain/entities/activity-location.entity';

export class ActivityLocationResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;

  constructor(id: number, name: string) {
    this._id = id;
    this._name = name;
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  static from(activityLocation: ActivityLocation): ActivityLocationResponseDto {
    return new ActivityLocationResponseDto(
      activityLocation.id,
      activityLocation.name,
    );
  }
}
