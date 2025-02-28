import { ExceptionCode } from '@common/exceptions/exception-code';
import { BusinessException } from '@common/exceptions/base-exception';

export class InvalidAccessTokenException extends BusinessException {
  override readonly code = ExceptionCode.INVALID_ACCESS_TOKEN;

  constructor(message: string = '유효하지 않은 엑세스 토큰입니다.') {
    super(message);
  }
}
