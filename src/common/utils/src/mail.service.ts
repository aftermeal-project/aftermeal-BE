import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import emailConfiguration from '@config/email.config';
import { ConfigType } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { Transporter } from 'nodemailer';
import { HtmlTemplate } from '@common/utils/src/html-template.service';
import appConfiguration from '@config/app.config';

interface InvitationTemplateData {
  invitee: string;
  inviter: string;
  url: string;
}

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(
    @Inject(emailConfiguration.KEY)
    private readonly emailConfig: ConfigType<typeof emailConfiguration>,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
    private readonly htmlTemplate: HtmlTemplate,
  ) {
    this.transporter = createTransport({
      service: emailConfig.service,
      host: emailConfig.host,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }

  async sendInvitation(
    email: string,
    invitationVerifyToken: string,
  ): Promise<void> {
    const baseUrl = this.appConfig.baseUrl;
    const port = this.appConfig.port;

    const url = `${baseUrl}:${port}/api/v1/invitation-verify?invitationVerifyToken=${invitationVerifyToken}`;
    const invitationTemplateData: InvitationTemplateData = {
      invitee: '송유현',
      inviter: '관리자',
      url: url,
    };
    const invitationTemplate: string = await this.htmlTemplate.templateFromFile(
      'invitation',
      invitationTemplateData,
    );

    this.transporter.sendMail(
      {
        from: `식후땡 <${this.emailConfig.auth.user}>`,
        to: email,
        subject: `임시 초대 코드는 ${invitationVerifyToken}입니다.`,
        html: invitationTemplate,
      },
      (err, info) => {
        if (err) {
          Logger.error(err);
          throw new InternalServerErrorException(err);
        } else {
          Logger.log(info);
        }
      },
    );
  }
}
