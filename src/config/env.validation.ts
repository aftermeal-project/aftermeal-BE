import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  validateSync,
  ValidationError,
} from 'class-validator';
import { IsNumber, IsString } from 'class-validator';

enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  @IsNotEmpty()
  NODE_ENV: NodeEnvironment;

  @IsString()
  @IsNotEmpty()
  BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PW: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsNumber()
  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRY_TIME: number;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string;

  @IsNumber()
  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRY_TIME: number;

  @IsString()
  @IsNotEmpty()
  JWT_ISSUER: string;

  @IsNumber()
  @IsNotEmpty()
  INVITATION_EXPIRY_TIME: number;

  @IsString()
  @IsNotEmpty()
  CACHE_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  CACHE_PORT: number;

  @IsString()
  @IsNotEmpty()
  EMAIL_SERVICE: string;

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
