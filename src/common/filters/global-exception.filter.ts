import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseEntity } from '@common/models/response.entity';
import { instanceToPlain } from 'class-transformer';
import { ExceptionCode } from '@common/exceptions/exception-code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ExceptionCode = ExceptionCode.UNKNOWN_ERROR;
    let message: string =
      '확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요.';

    if (exception instanceof NotFoundException) {
      status = exception.getStatus();
      code = ExceptionCode.NO_HANDLER;
      message = '요청한 경로를 찾을 수 없습니다.';
      this.logger.warn(
        `Request ${request.method} ${request.url} - ${exception}`,
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
