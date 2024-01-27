import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { SignUpResponseDto } from '../dto/sign-up.response-dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from '../domain/user-status';
import { SignUpForm } from '../dto/sign-up.form';

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 사용자를 등록하는 메소드입니다.
   * @returns { SignUpResponseDto }
   * @throws BadRequestException 해당 이메일로 이미 등록된 계정이 있습니다.
   */
  async signUp(dto: SignUpForm): Promise<SignUpResponseDto> {
    const user: User = new User();
    user.name = dto.name;
    user.status = UserStatus.Activate;

    const savedUser: User = await this.userRepository.save(user);
    return new SignUpResponseDto(savedUser.id);
  }
}
