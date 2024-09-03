import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { LoginResponseDto } from '../presentation/dto/login-response.dto';
import { TokenService } from './token.service';
import { User } from '../../user/domain/entities/user.entity';
import { Role } from '../../role/domain/entities/role.entity';
import { RoleService } from '../../role/application/role.service';
import { TokenRefreshResponseDto } from '../presentation/dto/token-refresh-response.dto';
import { AccessTokenPayload } from '../domain/types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly tokenService: TokenService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user: User = await this.userService.getUserByEmail(email);
    const roles: Role[] = await this.roleService.getRolesByUserId(user.id);

    await user.checkPassword(password);

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(
        this.createAccessTokenPayload(user, roles),
      ),
      this.tokenService.generateRefreshToken(),
    ]);

    await this.tokenService.saveRefreshToken(refreshToken, user.id);

    return new LoginResponseDto(
      accessToken,
      this.tokenService.getTokenType(),
      this.tokenService.getAccessTokenExpirationTime(),
      refreshToken,
    );
  }

  async refresh(currentRefreshToken: string): Promise<TokenRefreshResponseDto> {
    const userId: number =
      await this.tokenService.validateRefreshToken(currentRefreshToken);

    const [user, roles] = await Promise.all([
      this.userService.getUserById(userId),
      this.roleService.getRolesByUserId(userId),
    ]);

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(
        this.createAccessTokenPayload(user, roles),
      ),
      this.tokenService.generateRefreshToken(),
    ]);

    await this.tokenService.revokeRefreshToken(currentRefreshToken);
    await this.tokenService.saveRefreshToken(refreshToken, userId);

    return new TokenRefreshResponseDto(
      accessToken,
      this.tokenService.getTokenType(),
      this.tokenService.getAccessTokenExpirationTime(),
      refreshToken,
    );
  }

  private createAccessTokenPayload(
    user: User,
    roles: Role[],
  ): AccessTokenPayload {
    return {
      sub: user.uuid,
      username: user.name,
      email: user.email,
      roles: roles.map((role) => role.name),
    };
  }
}
