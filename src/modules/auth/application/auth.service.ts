import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/domain/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import jwtConfiguration from '@config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { compare } from 'bcrypt';
import { generateRandomString } from '@common/utils/src/generate-random-string';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user: User | null = await this.userRepository.findOneBy({
      email: dto.email,
    });
    this.checkUserExistence(user);

    const isMatch: boolean = await compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const accessToken: string = this.generateAccessToken(user);

    return new LoginResponseDto(
      accessToken,
      'Bearer',
      this.jwtConfig.accessToken.expiresIn,
    );
  }

  private checkUserExistence(user: User | null): void {
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
  }

  private generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: this.jwtConfig.accessToken.secret,
      expiresIn: this.jwtConfig.accessToken.expiresIn,
    });
  }
}
