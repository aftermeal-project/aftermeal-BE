import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { ResponseEntity } from '@common/entities/response.entity';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Public } from '@common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
      }),
    )
    dto: LoginRequestDto,
  ): Promise<ResponseEntity<LoginResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '로그인 성공',
      await this.authService.login(dto),
    );
  }
}
