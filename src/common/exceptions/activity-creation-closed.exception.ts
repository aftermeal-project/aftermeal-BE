import { ExceptionCode } from '@common/exceptions/exception-code';
import { BusinessException } from '@common/exceptions/base-exception';

export class ActivityCreationClosedException extends BusinessException {
  override readonly code = ExceptionCode.ACTIVITY_CREATION_CLOSED;

  constructor(
    message: string = '활동 생성이 마감되었습니다. 다른 날짜 또는 유형으로 진행해주세요.',
  ) {
    super(message);
  }
}
