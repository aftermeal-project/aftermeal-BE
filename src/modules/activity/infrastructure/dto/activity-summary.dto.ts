import { LocalDate, ZonedDateTime } from '@js-joda/core';
import { EActivityType } from '../../domain/types/activity-type';
import { Expose } from 'class-transformer';

export class ActivitySummaryDto {
  @Expose({ name: 'activity_id' })
  readonly id: number;

  @Expose({ name: 'activity_title' })
  readonly title: string;

  @Expose({ name: 'location_id' })
  readonly locationId: number;

  @Expose({ name: 'location_name' })
  readonly locationName: string;

  @Expose({ name: 'activity_max_participants' })
  readonly maxParticipants: number;

  @Expose({ name: 'activity_current_participants' })
  readonly currentParticipants: number;

  @Expose({ name: 'activity_type' })
  readonly type: string;

  @Expose({ name: 'activity_scheduled_date' })
  readonly scheduledDate: string;

  @Expose({ name: 'activity_application_start_at' })
  readonly applicationStartAt: string;

  @Expose({ name: 'activity_application_end_at' })
  readonly applicationEndAt: string;
}
