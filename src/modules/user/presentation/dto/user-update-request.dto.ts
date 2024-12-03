import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from '../../domain/entities/user-type';
import { UserStatus } from '../../domain/entities/user-status';
import { Role } from '../../domain/entities/role';

export class UserUpdateRequestDto {
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름은 빈 값일 수 없습니다.' })
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

  @IsInt({ message: '기수는 정수여야 합니다.' })
  @IsOptional()
  generationNumber?: number;

  @IsEnum(Role, {
    message: `역할은 다음 값 중 하나여야 합니다: ${Object.values(Role)}`,
  })
  @IsOptional()
  role?: Role;
}
