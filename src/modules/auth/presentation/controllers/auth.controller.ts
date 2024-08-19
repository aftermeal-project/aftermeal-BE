import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';
import { ResponseEntity } from '@common/models/response.entity';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Public } from '@common/decorators/public.decorator';
import { TokenRefreshResponseDto } from '../dto/token-refresh-response.dto';
import { TokenRefreshRequestDto } from '../dto/token-refresh-request.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ description: 'OK', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<ResponseEntity<LoginResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '로그인 성공',
      await this.authService.login(dto.email, dto.password),
    );
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiCreatedResponse({
    description: 'OK',
    type: TokenRefreshResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async refresh(
    @Body() dto: TokenRefreshRequestDto,
  ): Promise<ResponseEntity<TokenRefreshResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '토큰 갱신 성공',
      await this.authService.refresh(dto.refreshToken),
    );
  }
}
