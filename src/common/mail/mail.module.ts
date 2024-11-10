import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { HtmlTemplate } from './html-template';

@Module({
  providers: [MailService, HtmlTemplate],
  exports: [MailService],
})
export class MailModule {}
