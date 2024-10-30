import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { TOKEN_REPOSITORY } from '@common/constants/dependency-token';
import tokenConfiguration from '@config/token.config';
import { TokenRepository } from '../../../auth/domain/repositories/token.repository';
import { generateRandomString } from '@common/utils/generate-random-string';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { AccessTokenPayload } from '../../../auth/domain/types/jwt-payload';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';

@Injectable()
export class TokenService {
  private static readonly TOKEN_TYPE = 'Bearer';
  private static readonly REFRESH_TOKEN_LENGTH = 32;
  private static readonly EMAIL_VERIFICATION_TOKEN_LENGTH = 32;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(tokenConfiguration.KEY)
    private readonly tokenConfig: ConfigType<typeof tokenConfiguration>,
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: TokenRepository,
  ) {}

  async getUserIdByRefreshToken(refreshToken: string): Promise<number> {
    const userId: number =
      await this.tokenRepository.findUserIdByRefreshToken(refreshToken);

    if (!userId) {
      throw new ResourceNotFoundException('리프레시 토큰을 찾을 수 없습니다.');
    }

    return userId;
  }

  async getEmailByEmailVerificationToken(
    emailVerificationToken: string,
  ): Promise<string> {
    const email: string =
      await this.tokenRepository.findEmailByEmailVerificationToken(
        emailVerificationToken,
      );

    if (!email) {
      throw new ResourceNotFoundException('인증 토큰을 찾을 수 없습니다.');
    }

    return email;
  }

  generateAccessToken(payload: AccessTokenPayload): string {
    this.validatePayload(payload);
    return this.jwtService.sign(payload, {
      secret: this.tokenConfig.accessToken.secret,
      expiresIn: this.tokenConfig.accessToken.expiresIn,
    });
  }

  generateRefreshToken(): string {
    return generateRandomString(TokenService.REFRESH_TOKEN_LENGTH);
  }

  generateEmailVerificationToken(): string {
    return generateRandomString(TokenService.EMAIL_VERIFICATION_TOKEN_LENGTH);
  }

  async saveRefreshToken(refreshToken: string, userId: number): Promise<void> {
    await this.tokenRepository.saveRefreshToken(
      refreshToken,
      userId,
      this.tokenConfig.refreshToken.ttl,
    );
  }

  async saveEmailVerificationToken(
    to: string,
    emailVerificationToken: string,
  ): Promise<void> {
    await this.tokenRepository.saveEmailVerificationToken(
      emailVerificationToken,
      to,
      this.tokenConfig.emailVerificationToken.ttl,
    );
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.deleteRefreshToken(refreshToken);
  }

  async revokeEmailVerificationToken(
    emailVerificationToken: string,
  ): Promise<void> {
    await this.tokenRepository.deleteEmailVerificationToken(
      emailVerificationToken,
    );
  }

  getAccessTokenExpirationTime(): number {
    return this.tokenConfig.accessToken.expiresIn;
  }

  getTokenType(): string {
    return TokenService.TOKEN_TYPE;
  }

  private validatePayload(payload: AccessTokenPayload): void {
    if (!payload.sub || !payload.username || !payload.roles) {
      throw new IllegalArgumentException('페이로드가 유효하지 않습니다.');
    }
  }
}
