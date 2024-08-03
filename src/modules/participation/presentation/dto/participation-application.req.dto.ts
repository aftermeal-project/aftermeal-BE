import { IsPositive } from 'class-validator';

export class ParticipationApplicationRequestDTO {
  @IsPositive({ message: '활동 ID는 양수여야 합니다.' })
  activityId: number;
}
