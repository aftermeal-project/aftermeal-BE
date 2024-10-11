import { Exclude, Expose } from 'class-transformer';

// 에러 세부 정보 인터페이스
type ErrorDetails = {
  code: string;
  message: string;
};

export class ResponseEntity<T> {
  @Exclude() private readonly _success: boolean;
  @Exclude() private readonly _data?: T;
  @Exclude() private readonly _error?: ErrorDetails;

  private constructor(success: boolean, data?: T, error?: ErrorDetails) {
    this._success = success;
    if (success) {
      this._data = data;
    } else {
      this._error = error;
    }
  }

  static SUCCESS<T>(data?: T): ResponseEntity<T> {
    return new ResponseEntity(true, data, undefined);
  }

  static ERROR<T>(code: string, message: string): ResponseEntity<T> {
    const error: ErrorDetails = {
      code: code,
      message: message,
    };
    return new ResponseEntity(false, undefined, error);
  }

  @Expose()
  get success(): boolean {
    return this._success;
  }

  @Expose()
  get data(): T {
    return this._data;
  }

  @Expose()
  get error(): ErrorDetails {
    return this._error;
  }
}
