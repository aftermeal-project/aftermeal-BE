import { ExceptionCode } from '@common/exceptions/exception-code';
import { BaseException } from '@common/exceptions/base-exception';

export class InvalidEmailVerificationCodeException extends BaseException {
  override readonly code = ExceptionCode.INVALID_EMAIL_VERIFICATION_CODE;

  constructor(message: string = '유효하지 않은 이메일 인증 코드입니다.') {
    super(message);
  }
}
