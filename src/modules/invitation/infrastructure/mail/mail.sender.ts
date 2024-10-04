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
import { HtmlTemplate } from '../templates/html-template';
import appConfiguration from '@config/app.config';
import { Invitation } from '../../domain/invitation';

interface InvitationTemplateData {
  invitee: string;
  inviter: string;
  url: string;
}

@Injectable()
export class MailSender {
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

  async sendInvitation(invitation: Invitation): Promise<void> {
    const host = location.host;
    const port = this.appConfig.port;

    const url = `${host}:${port}/v1/invitation-verify?invitationToken=${invitation.code}`;
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
        to: invitation.inviteeEmail,
        subject: `임시 초대 코드는 ${invitation.code}입니다.`,
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
