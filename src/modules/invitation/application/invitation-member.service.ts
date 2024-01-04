import { InvitationService } from './invitation.service';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailService } from '@common/utils/src/mail.service';
import cacheConfiguration from '@config/cache.config';
import { Cache } from 'cache-manager';
import { ConfigType } from '@nestjs/config';
import { MemberType } from '../../user/domain/vo/member-type';
import { InvitationForm } from '../dto/invitation.form';

interface InvitationVerifyToken {
  email: string;
  type: MemberType;
  generationNumber?: number;
}

@Injectable()
export class InvitationMemberService implements InvitationService {
  private readonly INVITATION_TTL: number;

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(cacheConfiguration.KEY)
    private readonly cacheConfig: ConfigType<typeof cacheConfiguration>,
    private readonly mailService: MailService,
  ) {
    this.INVITATION_TTL = this.cacheConfig.invitation.ttl;
  }

  async invite(invitationForm: InvitationForm): Promise<void> {
    for (const email of invitationForm.email) {
      const invitationVerifyToken: string = this.generateInvitationToken({
        email: email,
        type: invitationForm.memberType,
        generationNumber: invitationForm?.generationNumber,
      });

      await this.cacheManager.set(
        email,
        invitationVerifyToken,
        this.INVITATION_TTL,
      );
      await this.mailService.sendInvitation(email, invitationVerifyToken);
    }
  }

  private generateInvitationToken(
    invitationVerifyToken: InvitationVerifyToken,
  ): string {
    return btoa(invitationVerifyToken.toString());
  }
}
