import { ExceptionCode } from '@common/exceptions/exception-code';
import { BaseException } from '@common/exceptions/base-exception';

export class ResourceNotFoundException extends BaseException {
  override readonly code = ExceptionCode.RESOURCE_NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}
