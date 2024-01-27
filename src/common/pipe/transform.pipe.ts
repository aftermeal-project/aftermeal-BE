import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InviteRequestDto } from '../../modules/invitation/dto/invite.request-dto';

@Injectable()
export class TransformPipe implements PipeTransform<any> {
  async transform(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<InviteRequestDto> {
    return plainToInstance(metatype, value);
  }
}
