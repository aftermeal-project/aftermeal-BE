import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { TOKEN_REPOSITORY } from '@common/constants/dependency-token';
import tokenConfiguration from '@config/token.config';
import { TokenRepository } from '../../../auth/domain/repositories/token.repository';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { AccessTokenPayload } from '../../../auth/domain/types/jwt-payload';
import { randomBytes } from 'crypto';

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
  ) {}

  async getUserIdByRefreshToken(refreshToken: string): Promise<number> {
    const userId: number =
      await this.tokenRepository.findUserIdByRefreshToken(refreshToken);

    if (!userId) {
      throw new IllegalArgumentException('유효하지 않은 리프레시 토큰입니다.');
    }

    return userId;
  }

  async getEmailByEmailVerificationCode(
    emailVerificationToken: string,
  ): Promise<string> {
    const email: string | null =
      await this.tokenRepository.findEmailByEmailVerificationCode(
        emailVerificationToken,
      );

    if (!email) {
      throw new IllegalArgumentException(
        '유효하지 않은 이메일 인증 토큰입니다.',
      );
    }

    return email;
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

  async revokeEmailVerificationCode(
    emailVerificationToken: string,
  ): Promise<void> {
    await this.tokenRepository.deleteEmailVerificationCode(
      emailVerificationToken,
    );
  }

  getAccessTokenExpirationTime(): number {
    return this.tokenConfig.accessToken.expiresIn;
  }

  getTokenType(): string {
    return TokenService.TOKEN_TYPE;
  }
}
