import { BaseException } from '@common/exceptions/base.exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class UserAlreadyExistException extends BaseException {
  override readonly code = ExceptionCode.USER_EXIST;

  constructor(message: string) {
    super(message);
  }
}
