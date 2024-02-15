import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/domain/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import jwtConfiguration from '@config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserRole } from '../../user/domain/user-role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user: User | null = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const isCorrectPassword = await user.checkPassword(dto.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }

    const accessToken: string = await this.generateAccessToken(user);
    const timestamp: number = Math.floor(Date.now() / 1000);
    const exp = timestamp + this.jwtConfig.accessToken.expiresIn;
    return new LoginResponseDto(accessToken, 'Bearer', exp);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const userRoles: UserRole[] | null = await this.userRoleRepository.findBy({
      userId: user.id,
    });
    if (!userRoles) {
      throw new NotFoundException('존재하지 않는 권한입니다.');
    }
    const rolesName: string[] = userRoles.map((userRole) => userRole.role.name);

    const payload = {
      sub: user.email,
      iss: this.jwtConfig.issuer,
      userId: user.id,
      username: user.name,
      roles: rolesName,
    };
    return this.jwtService.sign(payload, {
      secret: this.jwtConfig.accessToken.secret,
      expiresIn: this.jwtConfig.accessToken.expiresIn,
    });
  }
}
