import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MailService } from '@common/utils/src/mail.service';
import { HtmlTemplate } from '@common/utils/src/html-template.service';
import { InvitationController } from './presentation/invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generation } from '../generation/domain/generation.entity';
import { InvitationMemberService } from './application/invitation-member.service';
import { IsExistGenerationConstraint } from '@common/decorator/validation/is-exist-generation';
import { IsGraduatedGenerationConstraint } from '@common/decorator/validation/is-graduated-generation';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([Generation])],
  providers: [
    InvitationMemberService,
    MailService,
    HtmlTemplate,
    IsExistGenerationConstraint,
    IsGraduatedGenerationConstraint,
  ],
  controllers: [InvitationController],
})
export class InvitationModule {}
