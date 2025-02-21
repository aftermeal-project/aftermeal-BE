import { ExceptionCode } from '@common/exceptions/exception-code';
import { BusinessException } from '@common/exceptions/base-exception';

export class ResourceNotFoundException extends BusinessException {
  override readonly code = ExceptionCode.RESOURCE_NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}
