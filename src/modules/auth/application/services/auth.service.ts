import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../../user/application/services/user.service';
import { LoginResponseDto } from '../../presentation/dto/login-response.dto';
import { TokenService } from '../../../token/application/services/token.service';
import { User } from '../../../user/domain/entities/user.entity';
import { TokenRefreshResponseDto } from '../../presentation/dto/token-refresh-response.dto';
import { MailService } from '@common/mail/mail.service';
import { InvalidPasswordException } from '@common/exceptions/invalid-password.exception';
import { InvalidEmailVerificationCodeException } from '@common/exceptions/invalid-email-verification-code.exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user: User = await this.userService.getUserByEmail(email);

    const isPasswordValid: boolean = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    const accessToken: string = this.tokenService.generateAccessToken({
      sub: user.uuid,
      username: user.name,
      role: user.role,
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
      role: user.role,
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

  async sendEmailVerification(to: string): Promise<void> {
    const code: string = this.tokenService.generateEmailVerificationCode();
    await this.tokenService.saveEmailVerificationCode(to, code);

    await this.mailService.sendEmailVerification(to, code);
  }

  async verifyEmailVerificationCode(
    email: string,
    emailVerificationCode: string,
  ): Promise<void> {
    const savedEmailVerificationCode: string | null =
      await this.tokenService.getEmailVerificationCodeByEmail(email);

    if (emailVerificationCode !== savedEmailVerificationCode) {
      throw new InvalidEmailVerificationCodeException();
    }

    await this.userService.activateUser(email);
    await this.tokenService.revokeEmailVerificationCode(email);
  }
}
