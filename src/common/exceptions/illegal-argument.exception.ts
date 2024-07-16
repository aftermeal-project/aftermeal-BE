import { BaseException } from '@common/exceptions/base.exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class IllegalArgumentException extends BaseException {
  override readonly code = ExceptionCode.ILLEGAL_ARGUMENT;

  constructor(message: string) {
    super(message);
  }
}
