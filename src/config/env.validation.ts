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
  HOST: string;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_TYPE: string;

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

export const validate = (config: Record<string, unknown>): EnvironmentVariables => {
  const validateConfig: EnvironmentVariables = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors: ValidationError[] = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validateConfig;
};