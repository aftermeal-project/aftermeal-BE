import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { ResponseEntity } from '@common/models/response.entity';
import { LoginRequestDTO } from './dto/login.req.dto';
import { LoginResponseDTO } from './dto/login.res.dto';
import { Public } from '@common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginRequestDTO,
  ): Promise<ResponseEntity<LoginResponseDTO>> {
    return ResponseEntity.OK_WITH_DATA(
      '로그인 성공',
      await this.authService.login(dto),
    );
  }
}
