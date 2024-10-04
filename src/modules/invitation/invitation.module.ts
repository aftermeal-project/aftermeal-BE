import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MailSender } from './infrastructure/mail/mail.sender';
import { HtmlTemplate } from './infrastructure/templates/html-template';
import { InvitationController } from './presentation/controllers/invitation.controller';
import { InvitationMemberService } from './application/services/invitation-member.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CacheModule.register(), UserModule],
  providers: [InvitationMemberService, MailSender, HtmlTemplate],
  controllers: [InvitationController],
})
export class InvitationModule {}
