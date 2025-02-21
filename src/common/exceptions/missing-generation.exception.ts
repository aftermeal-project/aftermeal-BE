import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class MissingGenerationException extends BusinessException {
  override readonly code = ExceptionCode.MISSING_GENERATION;

  constructor(message: string = '기수 정보가 없습니다.') {
    super(message);
  }
}
