import { ValueTransformer } from 'typeorm';
import { EActivityType } from './activity-type';

export class ActivityTypeTransformer implements ValueTransformer {
  to(entityValue: EActivityType): string {
    return entityValue.enumName;
  }

  from(databaseValue: string): EActivityType {
    return EActivityType.valueByName(databaseValue);
  }
}
