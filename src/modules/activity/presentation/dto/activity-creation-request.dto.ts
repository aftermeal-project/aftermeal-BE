import { IsDefined, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { EActivityType } from '../../domain/entities/activity-type';
import { LocalDate } from '@js-joda/core';
import { Transform } from 'class-transformer';
import { IsLocalDate } from '@common/validators/is-local-date';
import { IsEnumClass } from '@common/validators/is-enum-class';

export class ActivityCreationRequestDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 빈 값일 수 없습니다.' })
  @IsDefined({ message: '활동유형은 필수값입니다.' })
  title: string;

  @Min(1, { message: '최대 수용 인원은 최소 1명 이상이어야 합니다.' })
  @IsNotEmpty({ message: '최대 수용 인원은 필수값입니다.' })
  maxParticipants: number;

  @IsInt({ message: '활동 위치 ID는 정수여야 합니다.' })
  @IsNotEmpty({ message: '활동 위치 ID는 필수값입니다.' })
  activityLocationId: number;

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
  @IsNotEmpty({ message: '활동유형은 필수값입니다.' })
  type: EActivityType;

  @Transform(({ value }) => {
    try {
      return LocalDate.parse(value);
    } catch (e) {
      return value;
    }
  })
  @IsLocalDate({ message: '활동일자는 날짜 형식이어야 합니다.' })
  @IsNotEmpty({ message: '활동일자는 필수값입니다.' })
  scheduledDate: LocalDate;
}
