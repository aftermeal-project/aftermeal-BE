import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/domain/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import jwtConfiguration from '@config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { LoginRequestDTO } from '../presentation/dto/login.req.dto';
import { LoginResponseDTO } from '../presentation/dto/login.res.dto';
import { UserRole } from '../../role/domain/user-role.entity';
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

  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user: User = await this.userService.getOneByEmail(dto.email);
    await user.checkPassword(dto.password);

    const accessToken: string = await this.generateAccessToken(user);
    const timestamp: number = Math.floor(Date.now() / 1000);
    const exp: number = timestamp + this.jwtConfig.accessToken.expiresIn;

    return new LoginResponseDTO(accessToken, 'Bearer', exp);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const userRoles: UserRole[] = await this.userRoleRepository.findBy({
      userId: user.id,
    });

    const rolesName: string[] = userRoles.map((userRole) => userRole.role.name);
    const payload = {
      sub: user.email,
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
