import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { ResponseEntity } from '@common/models/response.entity';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Public } from '@common/decorators/public.decorator';
import { TokenRefreshResponseDto } from '../dto/token-refresh-response.dto';
import { TokenRefreshRequestDto } from '../dto/token-refresh-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<ResponseEntity<LoginResponseDto>> {
    return ResponseEntity.SUCCESS_WITH_DATA(
      await this.authService.login(dto.email, dto.password),
    );
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() dto: TokenRefreshRequestDto,
  ): Promise<ResponseEntity<TokenRefreshResponseDto>> {
    return ResponseEntity.SUCCESS_WITH_DATA(
      await this.authService.refresh(dto.refreshToken),
    );
  }
}
