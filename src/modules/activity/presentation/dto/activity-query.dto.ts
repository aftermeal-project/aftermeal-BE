import { LocalDate } from '@js-joda/core';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { EActivityType } from '../../domain/entities/activity-type';
import { IsLocalDate } from '@common/validators/is-local-date';
import { IsEnumClass } from '@common/validators/is-enum-class';

export class ActivityQueryDto {
  @Transform(({ value }) => {
    try {
      return LocalDate.parse(value);
    } catch (e) {
      return value;
    }
  })
  @IsLocalDate({ message: '활동일자는 YYYY-MM-DD 형식이어야 합니다.' })
  @IsNotEmpty({ message: '활동일자는 빈 값일 수 없습니다.' })
  @IsOptional()
  scheduledDate?: LocalDate;

  @Transform(({ value }) => {
    try {
      return EActivityType.valueOf(value);
    } catch (e) {
      return value;
    }
  })
  @IsEnumClass(EActivityType, {
    message:
      '활동유형은 다음 값 중 하나여야 합니다: ' +
      EActivityType.values().join(', '),
  })
  @IsNotEmpty({ message: '활동유형은 빈 값일 수 없습니다.' })
  @IsOptional()
  type?: EActivityType;
}
