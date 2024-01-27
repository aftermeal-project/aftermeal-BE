import { Body, Controller, Post } from '@nestjs/common';
import { SignUpService } from '../application/sign-up.service';
import { SignUpForm } from '../dto/sign-up.form';
import { SignUpResponseDto } from '../dto/sign-up.response-dto';
import { ResponseEntity } from '@common/model/response.entity';

@Controller('v1/users')
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  // @UseGuards(InvitationGuard) TODO: 구현
  @Post()
  async signUp(
    @Body() form: SignUpForm,
  ): Promise<ResponseEntity<SignUpResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '등록 성공',
      await this.signUpService.signUp(form),
    );
  }
}
