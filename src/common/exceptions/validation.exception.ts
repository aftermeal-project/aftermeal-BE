import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class ValidationException extends BusinessException {
  override readonly code = ExceptionCode.INVALID_REQUEST;

  constructor(message: string) {
    super(message);
  }
}
