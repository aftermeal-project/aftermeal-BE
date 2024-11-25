import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { EActivityType } from '../../domain/entities/activity-type';
import { LocalDate } from '@js-joda/core';
import { Transform } from 'class-transformer';
import { LocalDateValidator } from '@common/validators/local-date.validator';

export class ActivityCreationRequestDto {
  @IsNotEmpty({ message: '활동 제목은 빈 칸일 수 없습니다.' })
  @IsString({ message: '활동 제목은 문자열이어야 합니다.' })
  title: string;

  @IsPositive({ message: '최대 참가자 수는 양수여야 합니다.' })
  maxParticipants: number;

  @IsPositive({ message: '활동 위치 ID는 양수여야 합니다.' })
  activityLocationId: number;

  @IsEnum(EActivityType, {
    message: `활동 유형은 다음 중 하나여야 합니다: ${EActivityType.values()}`,
  })
  @Transform(({ value }) => {
    try {
      return EActivityType.valueOf(value);
    } catch (e) {
      return value;
    }
  })
  type: EActivityType;

  @Validate(LocalDateValidator)
  @Transform(({ value }) => {
    try {
      return LocalDate.parse(value);
    } catch (e) {
      return value;
    }
  })
  scheduledDate: LocalDate;
}
