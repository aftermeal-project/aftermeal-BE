import { BaseException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class GraduatedGenerationException extends BaseException {
  override readonly code = ExceptionCode.GRADUATED_GENERATION;

  constructor(message: string = '재학 중인 학생이어야 합니다.') {
    super(message);
  }
}
