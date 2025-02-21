import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseEntity } from '@common/models/response.entity';
import { instanceToPlain } from 'class-transformer';
import { ExceptionCode } from '@common/exceptions/exception-code';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { CustomLoggerService } from '@common/infrastructure/logger/custom-logger.service';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_LOGGER)
    private readonly logger: CustomLoggerService,
  ) {
    logger.setContext(CatchEverythingFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    const status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const code: ExceptionCode = ExceptionCode.UNKNOWN_ERROR;
    const message: string =
      '확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요.';

    const error: Error = this.ensureError(exception);
    this.logger.error(error.message, error.stack);

    response
      .status(status)
      .json(instanceToPlain(ResponseEntity.ERROR(code, message)));
  }

  ensureError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }
}
