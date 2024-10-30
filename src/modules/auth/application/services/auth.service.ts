import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user/application/services/user.service';
import { LoginResponseDto } from '../../presentation/dto/login-response.dto';
import { TokenService } from '../../../token/application/services/token.service';
import { User } from '../../../user/domain/entities/user.entity';
import { TokenRefreshResponseDto } from '../../presentation/dto/token-refresh-response.dto';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user: User = await this.userService.getUserByEmail(email);
    await user.checkPassword(password);

    const accessToken: string = this.tokenService.generateAccessToken({
      sub: user.uuid,
      username: user.name,
      roles: user.roles.map((userRole) => userRole.role.name),
    });
    const refreshToken: string = this.tokenService.generateRefreshToken();

    await this.tokenService.saveRefreshToken(refreshToken, user.id);

    return new LoginResponseDto(
      accessToken,
      this.tokenService.getTokenType(),
      this.tokenService.getAccessTokenExpirationTime(),
      refreshToken,
      user,
    );
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  async refresh(currentRefreshToken: string): Promise<TokenRefreshResponseDto> {
    let userId: number;

    try {
      userId =
        await this.tokenService.getUserIdByRefreshToken(currentRefreshToken);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw new IllegalArgumentException(
          '유효하지 않은 리프레시 토큰입니다.',
        );
      }
      throw error;
    }

    const user: User = await this.userService.getUserById(userId);

    const accessToken: string = this.tokenService.generateAccessToken({
      sub: user.uuid,
      username: user.name,
      roles: user.roles.map((userRole) => userRole.role.name),
    });
    const refreshToken: string = this.tokenService.generateRefreshToken();

    await this.tokenService.revokeRefreshToken(currentRefreshToken);
    await this.tokenService.saveRefreshToken(refreshToken, userId);

    return new TokenRefreshResponseDto(
      accessToken,
      this.tokenService.getTokenType(),
      this.tokenService.getAccessTokenExpirationTime(),
      refreshToken,
    );
  }

  /**
   * 이메일 인증 토큰을 검증합니다.
   * 검증에 성공하면 사용자를 활성화하고, 해당 인증 토큰을 폐기합니다.
   * @param emailVerificationToken
   */
  async verifyEmailVerificationToken(
    emailVerificationToken: string,
  ): Promise<void> {
    let email: string;

    try {
      email = await this.tokenService.getEmailByEmailVerificationToken(
        emailVerificationToken,
      );
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw new IllegalArgumentException(
          '유효하지 않은 이메일 인증 토큰입니다.',
        );
      }
      throw error;
    }

    await this.userService.activateUser(email);
    await this.tokenService.revokeEmailVerificationToken(
      emailVerificationToken,
    );
  }
}
