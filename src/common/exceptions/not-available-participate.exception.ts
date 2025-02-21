import { BusinessException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class NotAvailableParticipateException extends BusinessException {
  override readonly code = ExceptionCode.NOT_AVAILABLE_PARTICIPATE;

  constructor(message: string = '참가 신청 기간이 아닙니다.') {
    super(message);
  }
}
