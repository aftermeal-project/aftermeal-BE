import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { TOKEN_REPOSITORY } from '@common/constants';
import jwtConfiguration from '@config/jwt.config';
import { User } from '../../user/domain/user.entity';
import { TokenRepository } from '../domain/token.repository';
import { Role } from '../../role/domain/role.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: TokenRepository,
  ) {}

  async generateAccessToken(user: User, roles: Role[]): Promise<string> {
    const now = Date.now();
    const expiresIn = this.jwtConfig.refreshToken.expiresIn;

    const payload = {
      sub: user.uuid,
      username: user.name,
      email: user.email,
      roles: roles.map((role) => role.name),
      iat: Math.floor(now / 1000),
      exp: Math.floor(now / 1000) + expiresIn,
    };

    try {
      return this.jwtService.sign(payload, {
        secret: this.jwtConfig.accessToken.secret,
      });
    } catch (error) {
      throw new Error('액세스 토큰을 발급하는데 실패했습니다.');
    }
  }

  async generateRefreshToken(user: User): Promise<string> {
    const now = Date.now();
    const expiresIn = this.jwtConfig.refreshToken.expiresIn;

    const payload = {
      sub: user.uuid,
      iat: Math.floor(now / 1000),
      exp: Math.floor(now / 1000) + expiresIn,
    };

    const token: string = this.jwtService.sign(payload, {
      secret: this.jwtConfig.refreshToken.secret,
    });
    await this.tokenRepository.save(user.id, token);
    return token;
  }

  getAccessTokenExpiresIn(): number {
    return this.jwtConfig.accessToken.expiresIn;
  }
}
