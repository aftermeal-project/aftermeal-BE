import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../../role/domain/entities/role.entity';
import { UserType } from '../../domain/types/user-type';
import { GenerationService } from '../../../generation/application/services/generation.service';
import { RoleService } from '../../../role/application/services/role.service';
import { Transactional } from 'typeorm-transactional';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { UserRegistrationRequestDto } from '../../presentation/dto/user-registration-request.dto';
import { Generation } from '../../../generation/domain/entities/generation.entity';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { USER_REPOSITORY } from '@common/constants/dependency-token';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserResponseDto } from '../../presentation/dto/user-response.dto';
import { UserUpdateRequestDto } from '../../presentation/dto/user-update-request.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly generationService: GenerationService,
  ) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users: User[] = await this.userRepository.find();
    return users.map((user) => UserResponseDto.from(user));
  }

  async getUserById(userId: number): Promise<User> {
    const user: User | undefined =
      await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User | undefined =
      await this.userRepository.findOneByEmail(email);
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

    if (dto.type === UserType.STUDENT) {
      generation = await this.generationService.getGenerationByGenerationNumber(
        dto.generationNumber,
      );
    }

    const user: User = dto.toEntity(role, generation);
    await user.hashPassword();
    await this.userRepository.save(user);
  }

  async updateUserById(
    userId: number,
    dto: UserUpdateRequestDto,
  ): Promise<void> {
    const user: User = await this.getUserById(userId);
    user.update(dto.name, dto.type, dto.status);
    await this.userRepository.save(user);
  }

  async deleteUserById(userId: number): Promise<void> {
    const user: User = await this.getUserById(userId);
    await this.userRepository.delete(user);
  }

  private async validateEmailDuplication(email: string): Promise<void> {
    const isMemberExists: boolean =
      await this.userRepository.existsByEmail(email);
    if (isMemberExists) {
      throw new AlreadyExistException('이미 등록된 이메일입니다.');
    }
  }
}
