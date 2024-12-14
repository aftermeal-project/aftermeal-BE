import { BaseException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class AlreadyParticipateActivityException extends BaseException {
  override readonly code = ExceptionCode.ALREADY_PARTICIPATE_ACTIVITY;

  constructor(message: string = '이미 참가한 활동입니다.') {
    super(message);
  }
}
