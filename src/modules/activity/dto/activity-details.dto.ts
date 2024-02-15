import { Expose } from 'class-transformer';

export class ActivityDetailsDto {
  constructor(
    private readonly _activityId: number,
    private readonly _activityDetailsId: number,
    private _selected: boolean,
    private readonly _voteCount: number,
  ) {}

  @Expose()
  get activityId(): number {
    return this._activityId;
  }

  @Expose()
  get activityDetailsId(): number {
    return this._activityDetailsId;
  }

  @Expose()
  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  @Expose()
  get voteCount(): number {
    return this._voteCount;
  }
}
