import { Inject, Injectable } from '@nestjs/common';
import emailConfiguration from '@config/email.config';
import { ConfigType } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { HtmlTemplate } from '@common/mail/html-template';
import appConfiguration from '@config/app.config';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(
    @Inject(emailConfiguration.KEY)
    readonly emailConfig: ConfigType<typeof emailConfiguration>,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
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
    emailVerificationToken: string,
  ): Promise<void> {
    const baseUrl: string = this.appConfig.baseUrl;
    const verificationLink: string = `${baseUrl}/v1/auth/email-verify?token=${emailVerificationToken}`;

    const subject: string = '이메일 인증 요청';
    const html: string = await this.htmlTemplate.templateFromFile(
      'verification',
      { verificationLink },
    );

    await this.sendMail(to, subject, html);
  }

  private async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const from: string = `${this.emailConfig.sender.name} <${this.emailConfig.sender.address}>`;
    await this.transporter.sendMail({ from, to, subject, html });
  }
}
