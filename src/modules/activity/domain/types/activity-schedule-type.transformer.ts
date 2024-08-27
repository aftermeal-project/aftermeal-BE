import { ValueTransformer } from 'typeorm';
import { EActivityScheduleType } from './activity-schedule-type';

export class ActivityScheduleTypeTransformer implements ValueTransformer {
  to(entityValue: EActivityScheduleType): string {
    if (!entityValue) {
      return null;
    }

    return entityValue.enumName;
  }

  from(databaseValue: string): EActivityScheduleType {
    if (!databaseValue) {
      return null;
    }

    return EActivityScheduleType.valueByName(databaseValue);
  }
}
