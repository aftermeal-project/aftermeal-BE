export class ActivityRepoDto {
  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _maximumParticipants: number,
    private readonly _participantsCount: number,
  ) {}

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
