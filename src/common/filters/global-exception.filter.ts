import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseEntity } from '@common/models/response.entity';
import { instanceToPlain } from 'class-transformer';
import { ExceptionCode } from '@common/exceptions/exception-code';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { CustomLoggerService } from '@common/logger/custom-logger.service';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_LOGGER)
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext(GlobalExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ExceptionCode = ExceptionCode.UNKNOWN_ERROR;
    let message: string =
      '확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요.';

    if (exception instanceof HttpException) {
      if (exception instanceof NotFoundException) {
        code = ExceptionCode.NO_HANDLER;
        message = '요청한 경로를 찾을 수 없습니다.';
      } else if (exception instanceof ForbiddenException) {
        code = ExceptionCode.FORBIDDEN;
        message = '접근할 수 있는 권한이 없습니다.';
      }
      status = exception.getStatus();
      this.logger.warn(message);
    } else {
      const error: Error = this.ensureError(exception);
      this.logger.error(message, error.stack);
    }

    response
      .status(status)
      .json(instanceToPlain(ResponseEntity.ERROR(code, message)));
  }

  ensureError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }
}
