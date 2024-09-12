import { BaseException } from '@common/exceptions/base.exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class IllegalStateException extends BaseException {
  override readonly code = ExceptionCode.ILLEGAL_STATE;

  constructor(message: string) {
    super(message);
  }
}
