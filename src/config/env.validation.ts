import { ValidationError } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { IsNumber, IsString } from 'class-validator';

class EnvironmentVariables {
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
}

export const validate = (
  config: Record<string, unknown>,
): EnvironmentVariables => {
  const validateConfig: EnvironmentVariables = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );

  const errors: ValidationError[] = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length === 0) return validateConfig;

  throw new Error(errors.toString());
};
