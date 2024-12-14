import { BaseException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class InvalidRefreshTokenException extends BaseException {
  override readonly code = ExceptionCode.INVALID_REFRESH_TOKEN;

  constructor(message: string = '유효하지 않은 리프레시 토큰입니다.') {
    super(message);
  }
}
