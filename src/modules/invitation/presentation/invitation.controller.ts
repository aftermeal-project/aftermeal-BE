import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { InvitationService } from '../application/invitation.service';
import { InviteRequestDto } from '../dto/invite.request-dto';
import { ResponseEntity } from '@common/model/response.entity';
import { InvitationMemberService } from '../application/invitation-member.service';
import { MemberTypeValidationPipe } from '@common/pipe/member-type-validation.pipe';
import { InviteMember } from '../dto/invite.member';

@Controller('v1')
export class InvitationController {
  constructor(
    @Inject(InvitationMemberService)
    private readonly invitationService: InvitationService,
  ) {}

  // TODO: @UseGuards(AuthGuard)
  @Post('invitation/member')
  async invite(
    @Body(MemberTypeValidationPipe) dto: InviteRequestDto,
    // TODO @User() user: User,
  ): Promise<ResponseEntity<[]>> {
    await this.invitationService.invite(
      new InviteMember(
        dto.inviteeEmail,
        dto.inviteeMemberType,
        dto?.inviteeGenerationNumber,
      ),
    );
    return ResponseEntity.OK_WITH('초대장 전송에 성공하였습니다.');
  }

  @Get('invitation-verify')
  async invitationVerify(
    @Query('invitationCode') invitationCode: string,
  ): Promise<void> {
    // TODO: verify code
    // TODO: redirect to sign-up page
  }
}
