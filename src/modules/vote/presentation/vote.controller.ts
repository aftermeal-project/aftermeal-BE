import { Body, Controller, Post } from '@nestjs/common';
import { VoteService } from '../application/vote.service';
import { ResponseEntity } from '@common/model/response.entity';
import { VoteRequestDto } from '../dto/vote-request.dto';
import { User } from '@common/decorator/user.decorator';

@Controller('v1/vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  async vote(
    @Body() dto: VoteRequestDto,
    @User('userId') userId: number,
  ): Promise<ResponseEntity<void>> {
    await this.voteService.vote(dto, userId);
    return ResponseEntity.OK_WITH('투표 성공');
  }
}
