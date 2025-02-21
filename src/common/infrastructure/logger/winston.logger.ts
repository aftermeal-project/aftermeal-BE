import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfiguration from '@config/app.config';
import { createLogger, format, Logger, transports } from 'winston';
import { Format } from 'logform';
import { CustomLoggerService } from './custom-logger.service';
import { ClsService } from 'nestjs-cls';

const { combine, timestamp, ms, json, errors, printf } = format;

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements CustomLoggerService {
  private logger: Logger;
  private context: string;

  constructor(
    @Inject(appConfiguration.KEY)
    appConfig: ConfigType<typeof appConfiguration>,
    private readonly cls: ClsService,
  ) {
    const isProduction: boolean = appConfig.env === 'production';

    this.logger = createLogger({
      level: isProduction ? 'info' : 'debug',
      format: isProduction ? this.getJsonFormat() : this.getTextFormat(),
      transports: [
        isProduction
          ? new transports.File({
              filename: '/var/log/aftermeal/application.log',
            })
          : new transports.Console(),
      ],
    });
  }

  info(message: string, context?: string): void {
    const meta = { context: context ? context : this.context };
    this.logger.info(message, meta);
  }

  debug(message: string, context?: string): void {
    const meta = { context: context ? context : this.context };
    this.logger.debug(message, meta);
  }

  warn(message: string, context?: string): void {
    const meta = { context: context ? context : this.context };
    this.logger.warn(message, meta);
  }

  error(message: string, stack?: string, context?: string): void {
    const meta = { context: context ? context : this.context, stack };
    this.logger.error(message, meta);
  }

  setContext(context: string): void {
    this.context = context;
  }

  private getTextFormat(): Format {
    const textFormat: Format = printf(
      ({ timestamp, level, message, context, stack, ms }) => {
        const requestId = this.cls.get('requestID') || '';
        const logContext = context || '';
        const formattedStack = stack ? '\n' + stack : '';
        return `${timestamp} ${level.toUpperCase()} [${logContext}] [${requestId}] - ${message} ${ms} ${formattedStack}`;
      },
    );

    return combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      errors({ stack: true }),
      ms(),
      textFormat,
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
