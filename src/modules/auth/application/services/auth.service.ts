import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user/application/services/user.service';
import { LoginResponseDto } from '../../presentation/dto/login-response.dto';
import { TokenService } from '../../../token/application/services/token.service';
import { User } from '../../../user/domain/entities/user.entity';
import { TokenRefreshResponseDto } from '../../presentation/dto/token-refresh-response.dto';

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
    const userId: number =
      await this.tokenService.getUserIdByRefreshToken(currentRefreshToken);

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

  async verifyEmailVerificationCode(
    emailVerificationCode: string,
  ): Promise<void> {
    const email: string =
      await this.tokenService.getEmailByEmailVerificationCode(
        emailVerificationCode,
      );

    await this.userService.activateUser(email);
    await this.tokenService.revokeEmailVerificationCode(emailVerificationCode);
  }
}
