import { BaseException } from '@common/exceptions/base-exception';
import { ExceptionCode } from '@common/exceptions/exception-code';

export class AlreadyExistUserException extends BaseException {
  override readonly code = ExceptionCode.ALREADY_EXIST_USER;

  constructor(message = '이미 존재하는 사용자입니다.') {
    super(message);
  }
}
