import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { ResponseEntity } from '@common/model/response.entity';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Public } from '@common/decorator/public.decorator';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<ResponseEntity<LoginResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '로그인 성공',
      await this.authService.login(dto),
    );
  }
}
