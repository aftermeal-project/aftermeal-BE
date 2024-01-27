import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MailService } from '@common/utils/src/mail.service';
import { HtmlTemplate } from '@common/utils/src/html-template.service';
import { InvitationController } from './presentation/invitation.controller';
import { InvitationMemberService } from './application/invitation-member.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CacheModule.register(), UserModule],
  providers: [InvitationMemberService, MailService, HtmlTemplate],
  controllers: [InvitationController],
})
export class InvitationModule {}
