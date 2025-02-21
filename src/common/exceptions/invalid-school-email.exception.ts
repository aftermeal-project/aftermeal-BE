import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class InvalidSchoolEmailException extends BusinessException {
  override readonly code = ExceptionCode.INVALID_SCHOOL_EMAIL;

  constructor(message: string = '학생은 학교 이메일을 사용해야 합니다.') {
    super(message);
  }
}
