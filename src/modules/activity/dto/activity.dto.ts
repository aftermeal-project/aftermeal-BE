export class ActivityDto {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly maximumParticipants: number,
    private readonly participantsCount: number,
  ) {}
}
