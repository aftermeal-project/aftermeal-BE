import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '@common/exceptions/base.exception';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
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
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    const errorResponse = {
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      name: exception.name,
      message: exception.message,
    };

    response.status(status).json(errorResponse);
  }
}
