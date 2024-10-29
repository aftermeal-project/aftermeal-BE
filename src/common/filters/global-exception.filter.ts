import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseEntity } from '@common/models/response.entity';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { instanceToPlain } from 'class-transformer';
import { ExceptionCode } from '@common/exceptions/exception-code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let code: string;
    let message: string;

    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      code = ExceptionCode.NOT_FOUND;
      message = `Cannot ${request.method} ${request.url}`;
      this.logger.warn(`Resource not found: ${message}`);
    } else if (exception instanceof ResourceNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      code = exception.code;
      message = exception.message;
      this.logger.warn(`Resource not found: ${message}`);
    } else if (exception instanceof IllegalArgumentException) {
      status = HttpStatus.BAD_REQUEST;
      code = exception.code;
      message = exception.message;
      this.logger.warn(`Illegal argument: ${message}`);
    } else if (exception instanceof IllegalStateException) {
      status = HttpStatus.BAD_REQUEST;
      code = exception.code;
      message = exception.message;
      this.logger.warn(`Illegal state: ${message}`);
    } else if (exception instanceof AlreadyExistException) {
      status = HttpStatus.CONFLICT;
      code = exception.code;
      message = exception.message;
      this.logger.warn(`Already exist: ${message}`);
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = ExceptionCode.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';

      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = ExceptionCode.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      this.logger.error(`Unknown exception: ${exception}`);
    }

    const errorResponse: ResponseEntity<null> = ResponseEntity.ERROR(
      code,
      message,
    );

    response.status(status).json(instanceToPlain(errorResponse));
  }
}
