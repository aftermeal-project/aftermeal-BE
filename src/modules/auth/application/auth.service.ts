import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { LoginResponseDto } from '../presentation/dto/login-response.dto';
import { TokenService } from '../../token/application/token.service';
import { User } from '../../user/domain/user.entity';
import { Role } from '../../role/domain/role.entity';
import { RoleService } from '../../role/application/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly tokenService: TokenService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user: User = await this.userService.getUserByEmail(email);
    await user.checkPassword(password);

    const roles: Role[] = await this.roleService.getRolesByUserId(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({
        sub: user.id.toString(),
        username: user.name,
        email: user.email,
        roles: roles.map((role) => role.name),
      }),
      this.tokenService.generateRefreshToken(user.id),
    ]);

    return new LoginResponseDto(
      accessToken,
      'Bearer',
      this.tokenService.getAccessTokenExpirationTime(),
      refreshToken,
    );
  }
}
