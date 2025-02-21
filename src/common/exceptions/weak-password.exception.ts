import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class WeakPasswordException extends BusinessException {
  override readonly code = ExceptionCode.WEAK_PASSWORD;

  constructor(
    message: string = '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.',
  ) {
    super(message);
  }
}
