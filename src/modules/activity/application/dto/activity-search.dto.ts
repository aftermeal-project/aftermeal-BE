export class ActivitySearchDto {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _maximumParticipants: number;
  private readonly _participantsCount: number;

  constructor(
    id: number,
    name: string,
    maximumParticipants: number,
    participantsCount: number,
  ) {
    this._id = id;
    this._name = name;
    this._maximumParticipants = maximumParticipants;
    this._participantsCount = participantsCount;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get maximumParticipants(): number {
    return this._maximumParticipants;
  }

  get participantsCount(): number {
    return this._participantsCount;
  }
}
