import { PartialType } from '@nestjs/swagger';
import { ActivityCreationRequestDto } from './activity-creation-request.dto';

export class ActivityUpdateRequestDto extends PartialType(
  ActivityCreationRequestDto,
) {}
