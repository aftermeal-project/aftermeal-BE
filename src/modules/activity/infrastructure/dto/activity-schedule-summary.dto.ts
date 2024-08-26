export class ActivityScheduleSummaryDto {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _maxParticipants: number;
  private readonly _currentParticipants: number;

  constructor(
    id: number,
    name: string,
    maxParticipants: number,
    currentParticipants: number,
  ) {
    this._id = id;
    this._name = name;
    this._maxParticipants = maxParticipants;
    this._currentParticipants = currentParticipants;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get maxParticipants(): number {
    return this._maxParticipants;
  }

  get currentParticipants(): number {
    return this._currentParticipants;
  }
}
