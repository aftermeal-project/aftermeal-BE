import {
  IsEmail,
  IsEnum,
  IsPositive,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';
import { UserType } from '../domain/user-type';

export class UserRegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserType)
  userType: UserType;

  @IsPositive()
  @IsOptional()
  generationNumber?: number;

  @IsStrongPassword()
  password: string;
}
