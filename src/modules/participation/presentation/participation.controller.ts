import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ResponseEntity } from '@common/entities/response.entity';
import { ParticipationService } from '../application/participation.service';
import { ParticipationRequestDto } from '../dto/participation-request.dto';
import { User } from '@common/decorators/user.decorator';

@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post()
  async apply(
    @Body(ValidationPipe) dto: ParticipationRequestDto,
    @User('userId') userId: number,
  ): Promise<ResponseEntity<void>> {
    await this.participationService.apply(dto.activityId, userId);
    return ResponseEntity.OK_WITH('참가 신청에 성공했습니다.');
  }
}
