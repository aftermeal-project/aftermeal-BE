import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { InvitationService } from '../../application/services/invitation.service';
import { InviteRequestDto } from '../dto/invite-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { InvitationMemberService } from '../../application/services/invitation-member.service';
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
  ): Promise<ResponseEntity<null>> {
    await this.invitationService.invite(dto.toEntity(), userId);
    return ResponseEntity.SUCCESS();
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
