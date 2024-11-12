import { LocalDate } from '@js-joda/core';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ActivityQueryDto {
  @Transform(({ value }) => LocalDate.parse(value))
  @IsOptional()
  date?: LocalDate;
}
