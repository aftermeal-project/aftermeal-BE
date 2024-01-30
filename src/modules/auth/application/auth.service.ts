import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/domain/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginRequestDto } from '../dto/login.request-dto';
import { LoginResponseDto } from '../dto/login.response-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user: User | null = await this.userRepository.findOneBy({
      email: dto.email,
    });
    this.checkUserExistence(user);
    if (user.password !== dto.password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const accessTokenPayload = {
      email: user.email,
      sub: user.id,
    };
    const refreshTokenPayload = {};

    const accessToken: string = this.jwtService.sign(accessTokenPayload);
    const refreshToken: string = this.jwtService.sign(refreshTokenPayload);
    return new LoginResponseDto(accessToken, refreshToken); // <- jwt 응답 규격같은 게 있나?
  }

  private checkUserExistence(user: User | null): void {
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
  }
}
