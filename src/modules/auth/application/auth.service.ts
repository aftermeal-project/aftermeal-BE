import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { LoginRequestDto } from '../presentation/dto/login-request.dto';
import { LoginResponseDto } from '../presentation/dto/login-response.dto';
import { TokenService } from './token.service';
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

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user: User = await this.userService.getUserByEmail(dto.email);
    await user.checkPassword(dto.password);

    const roles: Role[] = await this.roleService.getRolesByUserId(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(user, roles),
      this.tokenService.generateRefreshToken(user),
    ]);

    return new LoginResponseDto(
      accessToken,
      'Bearer',
      this.tokenService.getAccessTokenExpiresIn(),
      refreshToken,
    );
  }
}
