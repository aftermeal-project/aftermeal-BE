import { Exclude, Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly _success: boolean;
  @Exclude() private readonly _message: string;
  @Exclude() private readonly _data: T;

  private constructor(success: boolean, message: string, data?: T) {
    this._success = success;
    this._message = message;
    this._data = data;
  }

  static OK_WITH(message: string): ResponseEntity<void> {
    return new ResponseEntity<void>(true, message);
  }

  static OK_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(true, message, data);
  }

  static ERROR_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(false, message, data);
  }

  @Expose()
  get success(): boolean {
    return this._success;
  }

  @Expose()
  get message(): string {
    return this._message;
  }

  @Expose()
  get data(): T {
    return this._data;
  }
}
