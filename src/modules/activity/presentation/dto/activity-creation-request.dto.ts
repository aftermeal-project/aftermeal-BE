import { IsEnum, IsPositive, IsString, Validate } from 'class-validator';
import { EActivityType } from '../../domain/types/activity-type';
import { LocalDate } from '@js-joda/core';
import { Transform } from 'class-transformer';
import { LocalDateValidator } from '@common/validators/local-date.validator';

export class ActivityCreationRequestDto {
  @IsString()
  title: string;

  @IsPositive()
  maxParticipants: number;

  @IsPositive()
  locationId: number;

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
