import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { Role } from '../../role/domain/role.entity';
import { UserType } from '../domain/user-type';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerationService } from '../../generation/application/generation.service';
import { RoleService } from '../../role/application/role.service';
import { Transactional } from 'typeorm-transactional';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { UserRegisterReqDto } from '../presentation/dto/user-register.req.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly generationService: GenerationService,
  ) {}

  async getOneById(userId: number): Promise<User> {
    const user: User | undefined = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  async getOneByEmail(email: string): Promise<User> {
    const user: User | undefined = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  @Transactional()
  async register(dto: UserRegisterReqDto): Promise<User> {
    await this.validateEmailDuplication(dto.email);

    const role: Role = await this.roleService.getOneByName('USER');
    const generation =
      dto.userType === UserType.STUDENT
        ? await this.generationService.getOneByGenerationNumber(
            dto.generationNumber,
          )
        : null;

    const user: User = dto.toEntity(role, generation);
    await user.hashPassword();
    return await this.userRepository.save(user);
  }

  private async validateEmailDuplication(email: string): Promise<void> {
    const isMemberExists: boolean = await this.userRepository.exists({
      where: {
        email: email,
      },
    });
    if (isMemberExists) {
      throw new IllegalArgumentException('이미 등록된 이메일입니다.');
    }
  }
}
