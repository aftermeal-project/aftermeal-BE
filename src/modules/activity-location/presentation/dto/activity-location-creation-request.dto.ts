import { IsString } from 'class-validator';

export class ActivityLocationCreationRequestDto {
  @IsString()
  name: string;
}
