import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class ExpiredTokenException extends BusinessException {
  override readonly code = ExceptionCode.EXPIRED_TOKEN;

  constructor(message: string = '만료된 토큰입니다.') {
    super(message);
  }
}
