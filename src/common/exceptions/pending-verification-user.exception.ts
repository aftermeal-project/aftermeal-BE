import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from './exception-code';

export class PendingVerificationUserException extends BusinessException {
  code = ExceptionCode.PENDING_VERIFICATION_USER;

  constructor(message: string = '이메일 인증이 완료되지 않은 사용자입니다.') {
    super(message);
  }
}
