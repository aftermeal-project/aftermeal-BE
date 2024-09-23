import { ActivityStatus } from '../../domain/types/activity-status';
import { LocalDate } from '@js-joda/core';

export class ActivitySummaryDto {
  private readonly _id: number;
  private readonly _title: string;
  private readonly _location: string;
  private readonly _maxParticipants: number;
  private readonly _currentParticipants: number;
  private readonly _status: ActivityStatus;
  private readonly _type: string;
  private readonly _scheduledDate: LocalDate;

  constructor(
    id: number,
    title: string,
    location: string,
    maxParticipants: number,
    currentParticipants: number,
    status: ActivityStatus,
    type: string,
    scheduledDate: string,
  ) {
    this._id = id;
    this._title = title;
    this._location = location;
    this._maxParticipants = maxParticipants;
    this._currentParticipants = currentParticipants;
    this._status = status;
    this._type = type;
    this._scheduledDate = LocalDate.parse(scheduledDate);
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get location(): string {
    return this._location;
  }

  get maxParticipants(): number {
    return this._maxParticipants;
  }

  get currentParticipants(): number {
    return this._currentParticipants;
  }

  get status(): ActivityStatus {
    return this._status;
  }

  get type(): string {
    return this._type;
  }

  get scheduledDate(): LocalDate {
    return this._scheduledDate;
  }
}
