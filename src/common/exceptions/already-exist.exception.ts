import { BaseException } from '@common/exceptions/base.exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class AlreadyExistException extends BaseException {
  override readonly code = ExceptionCode.ALREADY_EXIST;

  constructor(message: string) {
    super(message);
  }
}
