import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../../role/domain/entities/role.entity';
import { UserType } from '../../domain/types/user-type';
import { GenerationService } from '../../../generation/application/services/generation.service';
import { RoleService } from '../../../role/application/services/role.service';
import { Transactional } from 'typeorm-transactional';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { UserRegistrationRequestDto } from '../../presentation/dto/user-registration-request.dto';
import { Generation } from '../../../generation/domain/entities/generation.entity';
import { USER_REPOSITORY } from '@common/constants/dependency-token';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserResponseDto } from '../../presentation/dto/user-response.dto';
import { UserUpdateRequestDto } from '../../presentation/dto/user-update-request.dto';
import { MailService } from '@common/mail/mail.service';
import { TokenService } from '../../../token/application/services/token.service';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly generationService: GenerationService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
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

  @Transactional()
  async register(dto: UserRegistrationRequestDto): Promise<void> {
    const existUser: User = await this.userRepository.findOneByEmail(dto.email);

    if (existUser) {
      if (existUser.isCandidate()) {
        await this.sendEmailVerification(existUser.email);
        return;
      }
      throw new AlreadyExistException('이미 등록된 이메일입니다.');
    }

    let generation: Generation | undefined;

    if (dto.type === UserType.STUDENT) {
      generation = await this.generationService.getGenerationByGenerationNumber(
        dto.generationNumber,
      );
    }

    const role: Role = await this.roleService.getRoleByRoleName('USER');

    const user: User =
      dto.type === UserType.STUDENT
        ? User.createStudent(
            dto.name,
            dto.email,
            role,
            generation,
            dto.password,
          )
        : User.createTeacher(dto.name, dto.email, role, dto.password);

    await user.hashPassword();
    await this.userRepository.save(user);

    await this.sendEmailVerification(user.email);
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

  async activateUser(email: string): Promise<void> {
    const user: User = await this.getUserByEmail(email);
    user.activate();
    await this.userRepository.save(user);
  }

  private async sendEmailVerification(to: string): Promise<void> {
    const code: string = this.tokenService.generateEmailVerificationCode();
    await this.tokenService.saveEmailVerificationCode(to, code);

    await this.mailService.sendEmailVerification(to, code);
  }
}
