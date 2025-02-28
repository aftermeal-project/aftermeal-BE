import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserType } from '../../domain/entities/user-type';
import { GenerationService } from '../../../generation/application/services/generation.service';
import { Transactional } from 'typeorm-transactional';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { UserRegistrationRequestDto } from '../../presentation/dto/user-registration-request.dto';
import { Generation } from '../../../generation/domain/entities/generation.entity';
import { USER_REPOSITORY } from '@common/constants/dependency-token';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserResponseDto } from '../../presentation/dto/user-response.dto';
import { UserUpdateRequestDto } from '../../presentation/dto/user-update-request.dto';
import { AuthService } from '../../../auth/application/services/auth.service';
import { AlreadyExistUserException } from '@common/exceptions/already-exist-user.exception';
import { PendingVerificationUserException } from '@common/exceptions/pending-verification-user.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly generationService: GenerationService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users: User[] = await this.userRepository.find();
    return users.map((user) => UserResponseDto.from(user));
  }

  async getUserById(userId: number): Promise<User> {
    const user: User | undefined =
      await this.userRepository.findOneById(userId);
    if (!user) {
      throw new ResourceNotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User | undefined =
      await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new ResourceNotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  async getUserByUuid(uuid: string): Promise<User> {
    const user: User | undefined =
      await this.userRepository.findOneByUuid(uuid);
    if (!user) {
      throw new ResourceNotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  @Transactional()
  async register(dto: UserRegistrationRequestDto): Promise<void> {
    const existUser: User | undefined =
      await this.userRepository.findOneByEmail(dto.email);

    if (existUser && existUser.isCandidate()) {
      throw new PendingVerificationUserException();
    }

    if (existUser) {
      throw new AlreadyExistUserException();
    }

    let generation: Generation | undefined;

    if (dto.type === UserType.STUDENT) {
      generation = await this.generationService.getGenerationByGenerationNumber(
        dto.generationNumber,
      );
    }

    const user: User =
      dto.type === UserType.STUDENT
        ? User.createStudent(dto.name, dto.email, generation, dto.password)
        : User.createTeacher(dto.name, dto.email, dto.password);

    await user.hashPassword();
    await this.userRepository.save(user);

    void this.authService.sendEmailVerification(user.email);
  }

  async updateUser(userId: number, dto: UserUpdateRequestDto): Promise<void> {
    const user: User = await this.getUserById(userId);
    user.update(dto.name, dto.type, dto.role, dto.status, dto.generationNumber);
    await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user: User = await this.getUserById(userId);
    await this.userRepository.delete(user);
  }

  async activateUser(email: string): Promise<void> {
    const user: User = await this.getUserByEmail(email);
    user.activate();
    await this.userRepository.save(user);
  }
}
