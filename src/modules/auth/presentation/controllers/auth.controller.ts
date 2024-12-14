import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { ResponseEntity } from '@common/models/response.entity';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Public } from '@common/decorators/public.decorator';
import { TokenRefreshResponseDto } from '../dto/token-refresh-response.dto';
import { TokenRefreshRequestDto } from '../dto/token-refresh-request.dto';
import { LogoutRequestDto } from '../dto/logout-request.dto';
import { EmailVerificationRequestDto } from '../dto/email-verification-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<ResponseEntity<LoginResponseDto>> {
    const loginResponseDto: LoginResponseDto = await this.authService.login(
      dto.email,
      dto.password,
    );
    return ResponseEntity.SUCCESS(loginResponseDto);
  }

  @Post('logout')
  async logout(@Body() dto: LogoutRequestDto): Promise<ResponseEntity<void>> {
    await this.authService.logout(dto.refreshToken);
    return ResponseEntity.SUCCESS();
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() dto: TokenRefreshRequestDto,
  ): Promise<ResponseEntity<TokenRefreshResponseDto>> {
    const tokenRefreshResponseDto: TokenRefreshResponseDto =
      await this.authService.refresh(dto.refreshToken);
    return ResponseEntity.SUCCESS(tokenRefreshResponseDto);
  }

  @Public()
  @Post('email-verify')
  async verifyEmail(
    @Body() dto: EmailVerificationRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.authService.verifyEmailVerificationCode(dto.email, dto.code);
    return ResponseEntity.SUCCESS();
  }
}
