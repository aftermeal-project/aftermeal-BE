import { Inject, Injectable } from '@nestjs/common';
import emailConfiguration from '@config/email.config';
import { ConfigType } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { HtmlTemplate } from './html-template';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(
    @Inject(emailConfiguration.KEY)
    readonly emailConfig: ConfigType<typeof emailConfiguration>,
    private readonly htmlTemplate: HtmlTemplate,
    @Inject(WINSTON_LOGGER)
    private readonly logger: CustomLoggerService,
  ) {
    this.transporter = createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: false,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
    this.logger.setContext(MailService.name);
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

    try {
      await this.transporter.sendMail({ from, to, subject, html });
      this.logger.info('이메일이 성공적으로 전송되었습니다.');
    } catch (error) {
      this.logger.error(
        '이메일을 보내는 중 오류가 발생했습니다.',
        error.stack,
        MailService.name,
      );
    }
  }
}
