import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { EActivityType } from '../../domain/entities/activity-type';
import { LocalDate } from '@js-joda/core';
import { Transform } from 'class-transformer';
import { LocalDateValidator } from '@common/validators/local-date.validator';

export class ActivityCreationRequestDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수값입니다.' })
  title: string;

  @Min(1, { message: '최대 수용 인원은 최소 1명 이상이어야 합니다.' })
  @IsNotEmpty({ message: '최대 수용 인원은 필수값입니다.' })
  maxParticipants: number;

  @IsInt({ message: '활동 위치 ID는 정수여야 합니다.' })
  @IsNotEmpty({ message: '활동 위치 ID는 필수값입니다.' })
  activityLocationId: number;

  @IsEnum(EActivityType, {
    message: `활동 유형은 다음 중 하나여야 합니다: ${EActivityType.values()}`,
  })
  @IsNotEmpty({ message: '활동 유형은 필수값입니다.' })
  @Transform(({ value }) => {
    try {
      return EActivityType.valueOf(value);
    } catch (e) {
      return value;
    }
  })
  type: EActivityType;

  @Validate(LocalDateValidator)
  @IsNotEmpty({ message: '예정 날짜는 필수값입니다.' })
  @Transform(({ value }) => {
    try {
      return LocalDate.parse(value);
    } catch (e) {
      return value;
    }
  })
  scheduledDate: LocalDate;
}
