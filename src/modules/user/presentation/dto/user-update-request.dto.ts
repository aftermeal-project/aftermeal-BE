import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserType } from '../../domain/types/user-type';
import { UserStatus } from '../../domain/types/user-status';

export class UserUpdateRequestDto {
  @IsNotEmpty({ message: '이름은 빈 값일 수 없습니다.' })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsOptional()
  name?: string;

  @IsEnum(UserType, {
    message: `사용자 타입은 다음 값 중 하나여야 합니다: ${Object.values(UserType)}`,
  })
  @IsOptional()
  type?: UserType;

  @IsEnum(UserStatus, {
    message: `사용자 상태는 다음 값 중 하나여야 합니다: ${Object.values(UserStatus)}`,
  })
  @IsOptional()
  status?: UserStatus;

  @IsPositive({ message: '기수는 양수여야 합니다.' })
  @IsOptional()
  generationNumber?: number;
}
