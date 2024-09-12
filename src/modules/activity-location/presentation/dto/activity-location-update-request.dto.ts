import { PartialType } from '@nestjs/swagger';
import { ActivityLocationCreationRequestDto } from './activity-location-creation-request.dto';

export class ActivityLocationUpdateRequestDto extends PartialType(
  ActivityLocationCreationRequestDto,
) {}
