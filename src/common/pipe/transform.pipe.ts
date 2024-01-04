import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InvitationForm } from '../../modules/invitation/dto/invitation.form';

@Injectable()
export class TransformPipe implements PipeTransform<any> {
  async transform(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<InvitationForm> {
    return plainToInstance(metatype, value);
  }
}
