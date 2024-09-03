import { Participation } from '../../../participation/domain/entities/participation.entity';
import { Exclude, Expose } from 'class-transformer';

export class ActivityParticipationResponseDto {
  @Exclude() private readonly _participationId: number;

  constructor(participationId: number) {
    this._participationId = participationId;
  }

  @Expose()
  get participationId(): number {
    return this._participationId;
  }

  static from(participation: Participation): ActivityParticipationResponseDto {
    return new ActivityParticipationResponseDto(participation.id);
  }
}
