import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  validateSync,
  ValidationError,
} from 'class-validator';
import { IsNumber, IsString } from 'class-validator';
import { ENVIRONMENT } from '@common/constants';

class EnvironmentVariables {
  @IsEnum(ENVIRONMENT)
  @IsOptional()
  NODE_ENV: ENVIRONMENT;

  @IsNumber()
  @IsNotEmpty()
  APP_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsNotEmpty()
  @IsString()
  DB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsNumber()
  ACCESS_TOKEN_EXPIRY_TIME: number;

  @IsNotEmpty()
  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsNumber()
  REFRESH_TOKEN_EXPIRY_TIME: number;
}

export const validate = (
  config: Record<string, unknown>,
): EnvironmentVariables => {
  const validateConfig: EnvironmentVariables = plainToClass(
    EnvironmentVariables,
    config,
    {
      enableImplicitConversion: true,
    },
  );
  const errors: ValidationError[] = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validateConfig;
};
