import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { EActivityType } from '../../domain/types/activity-type';
import { LocalDate } from '@js-joda/core';
import { Transform } from 'class-transformer';
import { LocalDateValidator } from '@common/validators/local-date.validator';

export class ActivityCreationRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsPositive()
  maxParticipants: number;

  @IsPositive()
  activityLocationId: number;

  @IsEnum(EActivityType)
  @Transform(({ value }) => {
    try {
      return EActivityType.valueOf(value);
    } catch (e) {
      return null;
    }
  })
  type: EActivityType;

  @Validate(LocalDateValidator)
  @Transform(({ value }) => {
    try {
      return LocalDate.parse(value);
    } catch (e) {
      return null;
    }
  })
  scheduledDate: LocalDate;
}
