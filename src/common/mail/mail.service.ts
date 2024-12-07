import { Inject, Injectable } from '@nestjs/common';
import emailConfiguration from '@config/email.config';
import { ConfigType } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { HtmlTemplate } from './html-template';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(
    @Inject(emailConfiguration.KEY)
    readonly emailConfig: ConfigType<typeof emailConfiguration>,
    private readonly htmlTemplate: HtmlTemplate,
  ) {
    this.transporter = createTransport({
      service: emailConfig.service,
      host: emailConfig.host,
      port: emailConfig.port,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }

  async sendEmailVerification(
    to: string,
    emailVerificationCode: string,
  ): Promise<void> {
    const subject: string = '이메일 인증 요청';
    const html: string = await this.htmlTemplate.templateFromFile(
      'verification',
      { emailVerificationCode },
    );

    await this.sendMail(to, subject, html);
  }

  private async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const from: string = '에프터밀 <aftermealonline@gmail.com>';
    await this.transporter.sendMail({ from, to, subject, html });
  }
}
