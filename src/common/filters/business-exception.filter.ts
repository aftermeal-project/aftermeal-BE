import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { BusinessException } from '@common/exceptions/base-exception';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ResponseEntity } from '@common/models/response.entity';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { ValidationException } from '@common/exceptions/validation.exception';
import { InvalidAccessTokenException } from '@common/exceptions/invalid-access-token.exception';
import { ExpiredTokenException } from '@common/exceptions/expired-token.exception';
import { AlreadyExistActivityLocationException } from '@common/exceptions/already-exist-activity-location.exception';
import { AlreadyExistUserException } from '@common/exceptions/already-exist-user.exception';
import { AlreadyParticipateActivityException } from '@common/exceptions/already-participate-activity.exception';
import { InvalidRefreshTokenException } from '@common/exceptions/invalid-refresh-token.exception';
import { InvalidEmailVerificationCodeException } from '@common/exceptions/invalid-email-verification-code.exception';
import { InvalidPasswordException } from '@common/exceptions/invalid-password.exception';
import { InvalidSchoolEmailException } from '@common/exceptions/invalid-school-email.exception';
import { InvalidScheduledDateException } from '@common/exceptions/invalid-scheduled-date.exception';
import { ExceedMaxParticipantException } from '@common/exceptions/exceed-max-participant.exception';
import { NotAvailableParticipateException } from '@common/exceptions/not-available-participate.exception';
import { ActivityCreationClosedException } from '@common/exceptions/activity-creation-closed.exception';
import { GraduatedGenerationException } from '@common/exceptions/graduated-generation.exception';
import { WeakPasswordException } from '@common/exceptions/weak-password.exception';
import { CustomLoggerService } from '@common/infrastructure/logger/custom-logger.service';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';
import { ExceptionCode } from '@common/exceptions/exception-code';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_LOGGER)
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext(BusinessExceptionFilter.name);
  }

  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    this.logger.warn(exception.message);

    const status: HttpStatus = this.getStatus(exception);
    const code: ExceptionCode = exception.code;
    const message: string = exception.message;

    response
      .status(status)
      .json(instanceToPlain(ResponseEntity.ERROR(code, message)));
  }

  private getStatus(exception: BusinessException): HttpStatus {
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
        return HttpStatus.BAD_REQUEST;
      case InvalidAccessTokenException:
      case InvalidRefreshTokenException:
      case InvalidEmailVerificationCodeException:
        return HttpStatus.UNAUTHORIZED;
      case ExpiredTokenException:
        return HttpStatus.FORBIDDEN;
      case ResourceNotFoundException:
        return HttpStatus.NOT_FOUND;
      case AlreadyExistActivityLocationException:
      case AlreadyExistUserException:
      case AlreadyParticipateActivityException:
        return HttpStatus.CONFLICT;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
