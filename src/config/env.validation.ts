import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ENVIRONMENT } from '@common/constants/environment';

class EnvironmentVariables {
  @IsEnum(ENVIRONMENT)
  @IsOptional()
  NODE_ENV: ENVIRONMENT;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsNumber()
  ACCESS_TOKEN_EXPIRATION_TIME: number;

  @IsNumber()
  REFRESH_TOKEN_EXPIRATION_TIME: number;

  @IsNumber()
  EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME: number;

  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  @IsNotEmpty()
  REDIS_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_HOST: string;

  @IsNumber()
  EMAIL_PORT: number;

  @IsString()
  @IsNotEmpty()
  EMAIL_AUTH_USER: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_AUTH_PASSWORD: string;
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
