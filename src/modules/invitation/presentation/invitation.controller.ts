import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { InvitationService } from '../application/invitation.service';
import { InviteRequestDTO } from './dto/invite.req.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { InvitationMemberService } from '../application/invitation-member.service';

@Controller('invitation')
export class InvitationController {
  constructor(
    @Inject(InvitationMemberService)
    private readonly invitationService: InvitationService,
  ) {}

  // TODO: @UseGuards(AuthGuard)
  @Post('member')
  async invite(
    @Body() dto: InviteRequestDTO,
    // TODO @User() user: User,
  ): Promise<ResponseEntity<void>> {
    await this.invitationService.invite(dto.toEntity());
    return ResponseEntity.OK_WITH('초대장 전송에 성공하였습니다.');
  }

  @Get('verify')
  async invitationVerify(
    @Query('invitationCode') invitationCode: string,
  ): Promise<void> {
    console.log(invitationCode);
    // TODO: verify code
    // TODO: redirect to sign-up page
  }
}
