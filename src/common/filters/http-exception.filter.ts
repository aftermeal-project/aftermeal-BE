import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionCode } from '@common/exceptions/exception-code';
import { instanceToPlain } from 'class-transformer';
import { ResponseEntity } from '@common/models/response.entity';
import { CustomLoggerService } from '@common/infrastructure/logger/custom-logger.service';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';

/**
 * HttpException을 포착하고, 이에 대한 사용자 정의 응답 로직을 구현하는 예외 필터
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_LOGGER)
    private readonly logger: CustomLoggerService,
  ) {
    logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const { code, message } = this.match(exception);

    this.logger.warn(exception.message);

    response
      .status(status)
      .json(instanceToPlain(ResponseEntity.ERROR(code, message)));
  }

  match(exception: HttpException): { code: ExceptionCode; message: string } {
    if (exception instanceof NotFoundException) {
      return {
        code: ExceptionCode.NO_HANDLER,
        message: '요청한 경로를 찾을 수 없습니다.',
      };
    }

    if (exception instanceof ForbiddenException) {
      return {
        code: ExceptionCode.FORBIDDEN,
        message: '접근할 수 있는 권한이 없습니다.',
      };
    }

    if (exception instanceof BadRequestException) {
      return {
        code: ExceptionCode.INVALID_REQUEST,
        message: '요청이 올바르지 않습니다.',
      };
    }
  }
}
