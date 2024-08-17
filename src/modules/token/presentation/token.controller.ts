import { Body, Controller, Post } from '@nestjs/common';
import { TokenService } from '../application/token.service';
import { Public } from '@common/decorators/public.decorator';
import { TokenRefreshRequestDto } from './dto/token-refresh-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { TokenRefreshResponseDto } from './dto/token-refresh-response.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Public()
  @Post('refresh')
  async refresh(
    @Body() dto: TokenRefreshRequestDto,
  ): Promise<ResponseEntity<TokenRefreshResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '토큰 갱신 성공',
      await this.tokenService.refresh(dto.refreshToken),
    );
  }
}
