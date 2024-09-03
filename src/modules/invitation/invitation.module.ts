import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { Mail } from '@common/utils/src/mail';
import { HtmlTemplate } from '@common/utils/src/html-template';
import { InvitationController } from './presentation/controllers/invitation.controller';
import { InvitationMemberService } from './application/invitation-member.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CacheModule.register(), UserModule],
  providers: [InvitationMemberService, Mail, HtmlTemplate],
  controllers: [InvitationController],
})
export class InvitationModule {}
