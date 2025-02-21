import { ExceptionCode } from '@common/exceptions/exception-code';

export abstract class BusinessException extends Error {
  abstract code: ExceptionCode;

  protected constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
