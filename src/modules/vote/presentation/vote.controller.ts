import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { VoteService } from '../application/vote.service';
import { ResponseEntity } from '@common/model/response.entity';
import { VoteRequestDto } from '../dto/vote-request.dto';
import { User } from '@common/decorator/user.decorator';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  async vote(
    @Body(ValidationPipe) dto: VoteRequestDto,
    @User('userId') userId: number,
  ): Promise<ResponseEntity<void>> {
    await this.voteService.vote(dto.activityId, userId);
    return ResponseEntity.OK_WITH('투표 성공');
  }
}
