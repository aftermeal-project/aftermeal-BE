import { InvitationService } from './invitation.service';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailSender } from '../../infrastructure/mail/mail.sender';
import { Cache } from 'cache-manager';
import { Invitation, Target } from '../../domain/invitation';
import { UserService } from '../../../user/application/services/user.service';
import { InviteRequestDto } from '../../presentation/dto/invite-request.dto';

@Injectable()
export class InvitationMemberService implements InvitationService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly mailService: MailSender,
    private readonly userService: UserService,
  ) {}

  async invite(dto: InviteRequestDto): Promise<void> {
    // for (const inviteeEmail of inviteMember.email) {
    //   const { id }: User = await this.userService.newCandidate(
    //     inviteeEmail,
    //     inviteMember.memberType,
    //     inviteMember?.generationNumber,
    //   );
    //
    //   const invitation: Invitation = Invitation.issue(
    //     {
    //       userId: id,
    //     },
    //     {
    //       duration: Invitation.DEFAULT_EXPIRED_DAYS,
    //       email: inviteeEmail,
    //     },
    //   );
    //   await this.issueInvitation(invitation);
    // }
    console.log(dto);
  }

  async getInvitationByTarget(target: Target): Promise<Invitation | null> {
    const invitationRedisKey: string = this.invitationRedisKey(target);
    return await this.cacheManager.get<Invitation>(invitationRedisKey);
  }

  async getInvitationByInvitationCode(
    invitationCode: string,
  ): Promise<Invitation> {
    const targetRedisKey: string = this.targetRedisKey(invitationCode);
    const target: Target = await this.cacheManager.get<Target>(targetRedisKey);
    return this.getInvitationByTarget(target);
  }

  private async issueInvitation(invitation: Invitation): Promise<void> {
    await this.saveInvitation(invitation);
    await this.mailService.sendInvitation(invitation);
  }

  private async saveInvitation(invitation: Invitation): Promise<void> {
    const ttl: number = invitation.remainDuration(Date.now());

    const invitationRedisKey: string = this.invitationRedisKey(
      invitation.target,
    );
    const targetRedisKey: string = this.targetRedisKey(invitation.code);

    await this.cacheManager.set(invitationRedisKey, invitation, ttl);
    await this.cacheManager.set(targetRedisKey, invitation.target, ttl);
  }

  private invitationRedisKey(target: Target): string {
    return 'invitation:target:' + target;
  }

  private targetRedisKey(invitationCode: string): string {
    return 'invitation:code:' + invitationCode;
  }
}
