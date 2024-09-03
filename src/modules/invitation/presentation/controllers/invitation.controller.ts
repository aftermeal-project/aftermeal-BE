import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { InvitationService } from '../../application/invitation.service';
import { InviteRequestDto } from '../dto/invite-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { InvitationMemberService } from '../../application/invitation-member.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('invitation')
export class InvitationController {
  constructor(
    @Inject(InvitationMemberService)
    private readonly invitationService: InvitationService,
  ) {}

  @Post('member')
  async invite(
    @Body() dto: InviteRequestDto,
    @CurrentUser('userId') userId: number,
  ): Promise<ResponseEntity<void>> {
    await this.invitationService.invite(dto.toEntity(), userId);
    return ResponseEntity.OK('초대장 전송에 성공하였습니다.');
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
