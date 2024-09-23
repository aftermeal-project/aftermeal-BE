import { Exclude, Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly _success: boolean;
  @Exclude() private readonly _data: T;

  private constructor(success: boolean, data: T | null = null) {
    this._success = success;
    this._data = data;
  }

  static SUCCESS(): ResponseEntity<null> {
    return new ResponseEntity(true);
  }

  static SUCCESS_WITH_DATA<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity(true, data);
  }

  @Expose()
  get success(): boolean {
    return this._success;
  }

  @Expose()
  get data(): T | null {
    return this._data;
  }
}
