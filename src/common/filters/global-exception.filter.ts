import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseEntity } from '@common/models/response.entity';
import { instanceToPlain } from 'class-transformer';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { BaseException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ExceptionCode = ExceptionCode.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';

    if (exception instanceof BaseException) {
      switch (exception.constructor) {
        case ResourceNotFoundException:
          status = HttpStatus.NOT_FOUND;
          break;
        case IllegalArgumentException && IllegalStateException:
          status = HttpStatus.BAD_REQUEST;
          break;
        case AlreadyExistException:
          status = HttpStatus.CONFLICT;
          break;
      }
      code = exception.code;
      message = exception.message;
      this.logger.warn(
        `Request ${request.method} ${request.url} - ${message}`,
        GlobalExceptionFilter.name,
      );
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = ExceptionCode[HttpStatus[status]];
      message = exception.message;
      this.logger.warn(
        `Request ${request.method} ${request.url} - ${message}`,
        GlobalExceptionFilter.name,
      );
    } else {
      this.logger.error(
        `Request ${request.method} ${request.url} - ${exception}`,
        GlobalExceptionFilter.name,
      );
    }

    response
      .status(status)
      .json(instanceToPlain(ResponseEntity.ERROR(code, message)));
  }
}
