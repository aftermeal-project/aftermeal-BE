import { IsNumber } from 'class-validator';

export class ParticipationRequestDto {
  @IsNumber()
  activityId: number;
}
