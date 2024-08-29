import { ValueTransformer } from 'typeorm';
import { EActivityScheduleType } from './activity-schedule-type';

export class ActivityScheduleTypeTransformer implements ValueTransformer {
  to(entityValue: EActivityScheduleType): string {
    return entityValue.enumName;
  }

  from(databaseValue: string): EActivityScheduleType {
    return EActivityScheduleType.valueByName(databaseValue);
  }
}
