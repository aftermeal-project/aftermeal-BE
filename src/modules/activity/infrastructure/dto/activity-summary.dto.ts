import { LocalDate, ZonedDateTime } from '@js-joda/core';
import { EActivityType } from '../../domain/types/activity-type';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';
import { Expose } from 'class-transformer';

export class ActivitySummaryDto {
  @Expose({ name: 'activity_id' })
  readonly id: number;

  @Expose({ name: 'activity_title' })
  readonly title: string;

  @Expose({ name: 'activity_location' })
  readonly location: ActivityLocation;

  @Expose({ name: 'activity_max_participants' })
  readonly maxParticipants: number;

  @Expose({ name: 'activity_current_participants' })
  readonly currentParticipants: number;

  @Expose({ name: 'activity_type' })
  readonly type: EActivityType;

  @Expose({ name: 'activity_scheduled_date' })
  readonly scheduledDate: LocalDate;

  @Expose({ name: 'activity_application_start_at' })
  readonly applicationStartAt: ZonedDateTime;

  @Expose({ name: 'activity_application_end_at' })
  readonly applicationEndAt: ZonedDateTime;
}
