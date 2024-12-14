import { BaseException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class ExceedMaxParticipantException extends BaseException {
  override readonly code = ExceptionCode.EXCEED_MAX_PARTICIPANT;

  constructor(message: string = '최대 참가인원이 초과되었습니다.') {
    super(message);
  }
}
