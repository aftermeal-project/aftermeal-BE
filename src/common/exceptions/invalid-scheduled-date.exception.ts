import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class InvalidScheduledDateException extends BusinessException {
  override readonly code = ExceptionCode.INVALID_SCHEDULED_DATE;

  constructor(
    message: string = '활동일자는 과거일자로 설정할 수 없습니다. 올바른 활동일자를 입력해주세요.',
  ) {
    super(message);
  }
}
