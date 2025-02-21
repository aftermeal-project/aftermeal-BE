import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class InvalidPasswordException extends BusinessException {
  override readonly code = ExceptionCode.INVALID_PASSWORD;

  constructor(message: string = '올바르지 않은 비밀번호입니다.') {
    super(message);
  }
}
