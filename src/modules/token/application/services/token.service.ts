import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { TOKEN_REPOSITORY } from '@common/constants/dependency-token';
import tokenConfiguration from '@config/token.config';
import { TokenRepository } from '../../../auth/domain/repositories/token.repository';
import { AccessTokenPayload } from '../../../auth/domain/types/jwt-payload';
import { randomBytes } from 'crypto';
import { InvalidAccessTokenException } from '@common/exceptions/invalid-access-token.exception';
import { ExpiredTokenException } from '@common/exceptions/expired-token.exception';
import { InvalidRefreshTokenException } from '@common/exceptions/invalid-refresh-token.exception';

@Injectable()
export class TokenService {
  private static readonly TOKEN_TYPE = 'Bearer';
  private static readonly REFRESH_TOKEN_LENGTH = 32;
  private static readonly EMAIL_VERIFICATION_CODE_LENGTH = 6;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(tokenConfiguration.KEY)
    private readonly tokenConfig: ConfigType<typeof tokenConfiguration>,
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: TokenRepository,
    private readonly logger: Logger,
  ) {}

  async verifyAccessToken(
    accessToken: string | undefined,
  ): Promise<AccessTokenPayload> {
    try {
      return this.jwtService.verifyAsync<AccessTokenPayload>(accessToken, {
        secret: this.tokenConfig.accessToken.secret,
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ExpiredTokenException();
      }
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'NotBeforeError'
      ) {
        throw new InvalidAccessTokenException();
      }
      throw error;
    }
  }

  async getUserIdByRefreshToken(refreshToken: string): Promise<number> {
    const userId: number =
      await this.tokenRepository.findUserIdByRefreshToken(refreshToken);

    if (!userId) {
      throw new InvalidRefreshTokenException();
    }

    return userId;
  }

  async getEmailVerificationCodeByEmail(email: string): Promise<string | null> {
    return this.tokenRepository.findEmailVerificationCodeByEmail(email);
  }

  generateAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.tokenConfig.accessToken.secret,
      expiresIn: this.tokenConfig.accessToken.expiresIn,
    });
  }

  generateRefreshToken(): string {
    return randomBytes(4)
      .toString('base64')
      .slice(0, TokenService.REFRESH_TOKEN_LENGTH);
  }

  generateEmailVerificationCode(): string {
    // crypto.randomBytes를 사용하여 암호학적으로 안전한 랜덤 바이트를 생성합니다.
    // readUInt32BE를 사용하여 4바이트를 부호 없는 32비트 정수로 변환합니다.
    // 1000000으로 나눈 나머지를 사용하여 0부터 999999 사이의 숫자를 만듭니다.
    // padStart()을 사용하여 6자리 형식을 유지합니다.
    const buffer: Buffer = randomBytes(4);
    const randomNumber: number = buffer.readUInt32BE(0) % 1000000;
    return randomNumber
      .toString()
      .padStart(TokenService.EMAIL_VERIFICATION_CODE_LENGTH, '0');
  }

  async saveRefreshToken(refreshToken: string, userId: number): Promise<void> {
    await this.tokenRepository.saveRefreshToken(
      refreshToken,
      userId,
      this.tokenConfig.refreshToken.ttl,
    );
  }

  async saveEmailVerificationCode(
    to: string,
    emailVerificationCode: string,
  ): Promise<void> {
    await this.tokenRepository.saveEmailVerificationCode(
      emailVerificationCode,
      to,
      this.tokenConfig.emailVerificationToken.ttl,
    );
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.deleteRefreshToken(refreshToken);
  }

  async revokeEmailVerificationCode(email: string): Promise<void> {
    await this.tokenRepository.deleteEmailVerificationCode(email);
  }

  getAccessTokenExpirationTime(): number {
    return this.tokenConfig.accessToken.expiresIn;
  }

  getTokenType(): string {
    return TokenService.TOKEN_TYPE;
  }
}
