import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/domain/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import jwtConfiguration from '@config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserRole } from '../../user/domain/user-role.entity';
import { UserService } from '../../user/application/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user: User | null = await this.userService.getOneByEmail(dto.email);
    const isCorrectPassword: boolean = await user.checkPassword(dto.password);
    if (!isCorrectPassword) {
      throw new BadRequestException('비밀번호가 올바르지 않습니다.');
    }

    const accessToken: string = await this.generateAccessToken(user);
    const timestamp: number = Math.floor(Date.now() / 1000);
    const exp: number = timestamp + this.jwtConfig.accessToken.expiresIn;

    return new LoginResponseDto(accessToken, 'Bearer', exp);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const userRoles: UserRole[] = await this.userRoleRepository.findBy({
      userId: user.id,
    });

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
