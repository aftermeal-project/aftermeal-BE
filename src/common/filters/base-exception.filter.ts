import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseException } from '@common/exceptions/base-exception';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ResponseEntity } from '@common/models/response.entity';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { ValidationException } from '@common/exceptions/validation.exception';
import { InvalidAccessTokenException } from '@common/exceptions/invalid-access-token.exception';
import { ExpiredTokenException } from '@common/exceptions/expired-token.exception';
import { AlreadyExistActivityLocationException } from '@common/exceptions/already-exist-activity-location.exception';
import { AlreadyExistUserException } from '@common/exceptions/already-exist-user.exception';
import { InvalidScheduledDateException } from '@common/exceptions/invalid-scheduled-date.exception';
import { InvalidEmailVerificationCodeException } from '@common/exceptions/invalid-email-verification-code.exception';
import { InvalidSchoolEmailException } from '@common/exceptions/invalid-school-email.exception';
import { InvalidPasswordException } from '@common/exceptions/invalid-password.exception';
import { InvalidRefreshTokenException } from '@common/exceptions/invalid-refresh-token.exception';
import { ExceedMaxParticipantException } from '@common/exceptions/exceed-max-participant.exception';
import { NotAvailableParticipateException } from '@common/exceptions/not-available-participate.exception';
import { ActivityCreationClosedException } from '@common/exceptions/activity-creation-closed.exception';
import { AlreadyParticipateActivityException } from '@common/exceptions/already-participate-activity.exception';
import { GraduatedGenerationException } from '@common/exceptions/graduated-generation.exception';
import { WeakPasswordException } from '@common/exceptions/weak-password.exception';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();

    let status: HttpStatus;

    switch (exception.constructor) {
      case ValidationException:
      case InvalidPasswordException:
      case InvalidSchoolEmailException:
      case InvalidScheduledDateException:
      case ExceedMaxParticipantException:
      case NotAvailableParticipateException:
      case ActivityCreationClosedException:
      case GraduatedGenerationException:
      case WeakPasswordException:
        status = HttpStatus.BAD_REQUEST;
        break;
      case InvalidAccessTokenException:
      case InvalidRefreshTokenException:
      case InvalidEmailVerificationCodeException:
        status = HttpStatus.UNAUTHORIZED;
        break;
      case ExpiredTokenException:
        status = HttpStatus.FORBIDDEN;
        break;
      case ResourceNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case AlreadyExistActivityLocationException:
      case AlreadyExistUserException:
      case AlreadyParticipateActivityException:
        status = HttpStatus.CONFLICT;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    this.logger.warn(
      `Request ${request.method} ${request.url} - ${exception.message}`,
      BaseExceptionFilter.name,
    );

    response
      .status(status)
      .json(
        instanceToPlain(
          ResponseEntity.ERROR(exception.code, exception.message),
        ),
      );
  }
}
