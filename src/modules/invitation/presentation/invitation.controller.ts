import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { InvitationService } from '../application/invitation.service';
import { InviteRequestDto } from './dto/invite.request-dto';
import { ResponseEntity } from '@common/entities/response.entity';
import { InvitationMemberService } from '../application/invitation-member.service';
import { InviteMember } from '../application/dto/invite.member';

@Controller('invitation')
export class InvitationController {
  constructor(
    @Inject(InvitationMemberService)
    private readonly invitationService: InvitationService,
  ) {}

  // TODO: @UseGuards(AuthGuard)
  @Post('member')
  async invite(
    @Body() dto: InviteRequestDto,
    // TODO @User() user: User,
  ): Promise<ResponseEntity<void>> {
    await this.invitationService.invite(
      new InviteMember(
        dto.inviteeEmail,
        dto.inviteeMemberType,
        dto?.inviteeGenerationNumber,
      ),
    );
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
