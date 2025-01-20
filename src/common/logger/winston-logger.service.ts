import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfiguration from '@config/app.config';
import { createLogger, format, Logger, transports } from 'winston';
import { Format } from 'logform';
import { CustomLoggerService } from '@common/logger/custom-logger.service';

const { combine, timestamp, ms, json, errors, printf } = format;

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements CustomLoggerService {
  private logger: Logger;
  private context: string;

  constructor(
    @Inject(appConfiguration.KEY)
    appConfig: ConfigType<typeof appConfiguration>,
  ) {
    const isProduction: boolean = appConfig.env === 'production';

    this.logger = createLogger({
      level: isProduction ? 'info' : 'debug',
      format: isProduction ? this.getJsonFormat() : this.getTextFormat(),
      transports: [
        isProduction
          ? new transports.File({ filename: 'combined.log' })
          : new transports.Console(),
      ],
    });
  }

  info(message: string, context?: string): void {
    this.logger.info(message, { context: context ? context : this.context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context: context ? context : this.context });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context: context ? context : this.context });
  }

  error(message: string, stack?: string, context?: string): void {
    this.logger.error(message, {
      context: context ? context : this.context,
      stack,
    });
  }

  setContext(context: string): void {
    this.context = context;
  }

  private getTextFormat(): Format {
    const myFormat: Format = printf(
      ({ timestamp, level, message, context, stack }) => {
        return `[${timestamp}] ${level.toUpperCase()} ${context ? '[' + context + ']' : ''} ${message} ${stack ? '\n' + stack : ''}`;
      },
    );

    return combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      myFormat,
    );
  }

  private getJsonFormat(): Format {
    return combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      ms(),
      errors({ stack: true }),
      json(),
    );
  }
}
