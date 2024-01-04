import { plainToClass } from 'class-transformer';
import { IsEnum, validateSync, ValidationError } from 'class-validator';
import { IsNumber, IsString } from 'class-validator';

enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment;

  @IsString()
  BASE_URL: string;

  @IsString()
  HOST: string;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PW: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsNumber()
  ACCESS_TOKEN_EXPIRY_TIME: number;

  @IsNumber()
  REFRESH_TOKEN_EXPIRY_TIME: number;

  @IsNumber()
  CACHE_INVITATION_TTL: number;

  @IsString()
  EMAIL_SERVICE: string;

  @IsString()
  EMAIL_AUTH_USER: string;

  @IsString()
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
