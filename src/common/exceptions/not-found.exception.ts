import { ExceptionCode } from '@common/exceptions/exception-code';
import { BaseException } from '@common/exceptions/base.exception';

export class NotFoundException extends BaseException {
  override readonly code = ExceptionCode.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}