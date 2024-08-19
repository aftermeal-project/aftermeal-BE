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
import { UserRegistrationRequestDto } from '../presentation/dto/user-registration-request.dto';
import { Generation } from '../../generation/domain/generation.entity';
import { UserAlreadyExistException } from '@common/exceptions/user-already-exist.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly generationService: GenerationService,
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user: User | undefined = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User | undefined = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  @Transactional()
  async register(dto: UserRegistrationRequestDto): Promise<void> {
    await this.validateEmailDuplication(dto.email);

    const role: Role = await this.roleService.getRoleByRoleName('USER');
    let generation: Generation | undefined;

    if (dto.userType === UserType.STUDENT) {
      generation = await this.generationService.getGenerationByGenerationNumber(
        dto.generationNumber,
      );
    }

    const user: User = dto.toEntity(role, generation);
    await user.hashPassword();
    await this.userRepository.save(user);
  }

  private async validateEmailDuplication(email: string): Promise<void> {
    const isMemberExists: boolean = await this.userRepository.exists({
      where: {
        email: email,
      },
    });
    if (isMemberExists) {
      throw new UserAlreadyExistException('이미 등록된 이메일입니다.');
    }
  }
}
