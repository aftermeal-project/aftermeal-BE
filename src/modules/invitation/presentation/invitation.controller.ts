import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { InvitationService } from '../application/invitation.service';
import { InviteRequestDto } from '../dto/invite.request-dto';
import { ResponseEntity } from '@common/model/response.entity';
import { InvitationMemberService } from '../application/invitation-member.service';
import { ValidationByMemberTypePipe } from '@common/pipe/validation-by-member-type.pipe';
import { InviteMember } from '../dto/invite.member';

@Controller('v1/invitation')
export class InvitationController {
  constructor(
    @Inject(InvitationMemberService)
    private readonly invitationService: InvitationService,
  ) {}

  // TODO: @UseGuards(AuthGuard)
  @Post('member')
  async invite(
    @Body(ValidationByMemberTypePipe) dto: InviteRequestDto,
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
    // TODO: verify code
    // TODO: redirect to sign-up page
  }
}
