import { Module } from '@nestjs/common';
import { MailService } from '@common/mail/mail.service';
import { HtmlTemplate } from '@common/mail/html-template';

@Module({
  providers: [MailService, HtmlTemplate],
  exports: [MailService],
})
export class MailModule {}
