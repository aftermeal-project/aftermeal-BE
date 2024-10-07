import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '@common/exceptions/base.exception';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { ResponseEntity } from '@common/models/response.entity';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(BaseExceptionFilter.name);

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number;

    switch (exception.constructor) {
      case NotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case IllegalArgumentException:
        status = HttpStatus.BAD_REQUEST;
        break;
      case IllegalStateException:
        status = HttpStatus.BAD_REQUEST;
        break;
      case AlreadyExistException:
        status = HttpStatus.CONFLICT;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    const errorResponse = {
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      code: exception.code,
      message: exception.message,
    };

    response.status(status).json(errorResponse);
  }
}
