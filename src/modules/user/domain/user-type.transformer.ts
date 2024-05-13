import { ValueTransformer } from 'typeorm';
import { EUserType } from './user-type';

export class UserTypeTransformer implements ValueTransformer {
  to(entityValue: EUserType): string {
    if (!entityValue) {
      return null;
    }

    return entityValue.enumName;
  }

  from(databaseValue: string): EUserType {
    if (!databaseValue) {
      return null;
    }

    return EUserType.valueByName(databaseValue);
  }
}
