import { IsNumber } from 'class-validator';

export class VoteRequestDto {
  @IsNumber()
  activityId: number;
}
