import { ExceptionCode } from '@common/exceptions/exception-code';
import { BaseException } from '@common/exceptions/base-exception';

export class AlreadyExistActivityLocationException extends BaseException {
  override readonly code = ExceptionCode.ALREADY_EXIST_ACTIVITY_LOCATION;

  constructor(message = '이미 존재하는 활동 장소입니다.') {
    super(message);
  }
}
