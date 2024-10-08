import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { REFRESH_TOKEN_REPOSITORY } from '@common/constants/dependency-token';
import jwtConfiguration from '@config/jwt.config';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { generateRandomString } from '@common/utils/generate-random-string';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { AccessTokenPayload } from '../../domain/types/jwt-payload';

@Injectable()
export class TokenService {
  private static readonly REFRESH_TOKEN_LENGTH = 32;
  private static readonly TOKEN_TYPE = 'Bearer';

  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly tokenRepository: RefreshTokenRepository,
  ) {}

  generateAccessToken(payload: AccessTokenPayload): string {
    this.validatePayload(payload);
    return this.jwtService.sign(payload, {
      secret: this.jwtConfig.accessToken.secret,
      expiresIn: this.jwtConfig.accessToken.expiresIn,
    });
  }

  generateRefreshToken(): string {
    return generateRandomString(TokenService.REFRESH_TOKEN_LENGTH);
  }

  async saveRefreshToken(refreshToken: string, userId: number): Promise<void> {
    await this.tokenRepository.save(
      refreshToken,
      userId,
      this.jwtConfig.refreshToken.expiresIn,
    );
  }

  async validateRefreshToken(refreshToken: string): Promise<number> {
    const userId: number =
      await this.tokenRepository.findByRefreshToken(refreshToken);
    if (!userId) {
      throw new IllegalArgumentException('Invalid refresh token');
    }
    return userId;
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete(refreshToken);
  }

  getAccessTokenExpirationTime(): number {
    return this.jwtConfig.accessToken.expiresIn;
  }

  getTokenType(): string {
    return TokenService.TOKEN_TYPE;
  }

  private validatePayload(payload: AccessTokenPayload) {
    if (!payload.sub || !payload.username || !payload.roles) {
      throw new IllegalArgumentException('Invalid payload');
    }
  }
}
