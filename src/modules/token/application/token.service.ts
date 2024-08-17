import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { TOKEN_REPOSITORY } from '@common/constants';
import jwtConfiguration from '@config/jwt.config';
import { TokenRepository } from '../domain/token.repository';
import { generateRandomString } from '@common/utils/src/generate-random-string';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { TokenRefreshResponseDto } from '../presentation/dto/token-refresh-response.dto';
import { User } from '../../user/domain/user.entity';
import { Role } from '../../role/domain/role.entity';
import { UserService } from '../../user/application/user.service';
import { RoleService } from '../../role/application/role.service';

type AccessTokenPayload = {
  sub: string;
  username: string;
  email: string;
  roles: string[];
};

@Injectable()
export class TokenService {
  private static readonly REFRESH_TOKEN_LENGTH = 32;

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: TokenRepository,
  ) {}

  generateAccessToken(payload: AccessTokenPayload): string {
    try {
      return this.jwtService.sign(payload, {
        secret: this.jwtConfig.accessToken.secret,
        expiresIn: this.jwtConfig.accessToken.expiresIn,
      });
    } catch (error) {
      throw new Error(`Failed to generate access token: ${error.message}`);
    }
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken: string = generateRandomString(
      TokenService.REFRESH_TOKEN_LENGTH,
    );

    try {
      await this.tokenRepository.save(
        refreshToken,
        userId,
        this.jwtConfig.refreshToken.expiresIn,
      );
      return refreshToken;
    } catch (error) {
      throw new Error(`Failed to generate refresh token: ${error.message}`);
    }
  }

  async refresh(currentRefreshToken: string): Promise<TokenRefreshResponseDto> {
    await this.validateRefreshToken(currentRefreshToken);

    const userId: number =
      await this.getUserIdByRefreshToken(currentRefreshToken);
    const user: User = await this.userService.getUserById(userId);
    const roles: Role[] = await this.roleService.getRolesByUserId(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        sub: user.id.toString(),
        username: user.name,
        email: user.email,
        roles: roles.map((role) => role.name),
      }),
      this.generateRefreshToken(user.id),
    ]);
    await this.revokeRefreshToken(currentRefreshToken);

    return new TokenRefreshResponseDto(
      accessToken,
      'Bearer',
      this.jwtConfig.accessToken.expiresIn,
      refreshToken,
    );
  }

  private async validateRefreshToken(
    currentRefreshToken: string,
  ): Promise<void> {
    const isExist: boolean =
      await this.tokenRepository.exist(currentRefreshToken);
    if (!isExist) {
      throw new Error('Invalid refresh token');
    }
  }

  private async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete(refreshToken);
  }

  private async getUserIdByRefreshToken(refreshToken: string): Promise<number> {
    const userId: number =
      await this.tokenRepository.findByRefreshToken(refreshToken);
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    return userId;
  }

  getAccessTokenExpirationTime() {
    return this.jwtConfig.accessToken.expiresIn;
  }
}
