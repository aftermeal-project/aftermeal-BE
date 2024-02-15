import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { UserRole } from '../domain/user-role.entity';
import { Role } from '../domain/role.entity';
import { Generation } from '../../generation/domain/generation.entity';
import { MemberType } from '../domain/member-type';
import { UserRegisterResponseDto } from '../dto/user-register-response.dto';
import { UserRegisterRequestDto } from '../dto/user-register-request.dto';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly userRoleRepository: Repository<UserRole>;
  private readonly roleRepository: Repository<Role>;
  private readonly generationRepository: Repository<Generation>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.userRoleRepository = this.dataSource.getRepository(UserRole);
    this.roleRepository = this.dataSource.getRepository(Role);
    this.generationRepository = this.dataSource.getRepository(Generation);
  }

  async register(
    dto: UserRegisterRequestDto,
  ): Promise<UserRegisterResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.verifyEmailDuplication(dto.email);
      let generation: Generation | null = null;

      if (dto.memberType === MemberType.Student) {
        generation = await this.generationRepository.findOneBy({
          generationNumber: dto.generationNumber,
        });
        this.checkGenerationExistence(generation);
        this.checkIfAlreadyGraduatedGeneration(generation);
      }

      const user: User = User.newMember(
        dto.name,
        dto.email,
        dto.password,
        dto.memberType,
        generation,
      );

      const role: Role | null = await this.roleRepository.findOneBy({
        name: 'ROLE_MEMBER',
      });
      this.checkRoleExistence(role);

      const savedUser: User = await this.userRepository.save(user);
      const userRole: UserRole = new UserRole();
      userRole.role = role;
      userRole.user = savedUser;
      await this.userRoleRepository.save(userRole);

      await queryRunner.commitTransaction();
      return new UserRegisterResponseDto(savedUser.id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async newCandidate(
    email: string,
    memberType: MemberType,
    generationNumber?: number | null,
  ): Promise<User> {
    await this.verifyEmailDuplication(email);
    let generation: Generation | null = null;

    if (memberType === MemberType.Student) {
      generation = await this.generationRepository.findOneBy({
        generationNumber: generationNumber,
      });
      this.checkGenerationExistence(generation);
      this.checkIfAlreadyGraduatedGeneration(generation);
    }

    const candidateMember: User = User.newCandidate(
      email,
      memberType,
      generation,
    );
    const savedUser: User = await this.userRepository.save(candidateMember);

    const role: Role | null = await this.roleRepository.findOneBy({
      name: 'ROLE_MEMBER',
    });
    this.checkRoleExistence(role);

    const userRole: UserRole = new UserRole();
    userRole.role = role;
    userRole.user = savedUser;
    await this.userRoleRepository.save(userRole);

    return savedUser;
  }

  private checkGenerationExistence(generation: Generation | null): void {
    if (!generation) {
      throw new BadRequestException('존재하지 않는 기수입니다.');
    }
  }

  private checkRoleExistence(role: Role | null): void {
    if (!role) {
      throw new BadRequestException('존재하지 않는 권한입니다.');
    }
  }

  private checkIfAlreadyGraduatedGeneration(generation: Generation): void {
    if (generation.isGraduated) {
      throw new BadRequestException('이미 졸업한 기수입니다.');
    }
  }

  private async verifyEmailDuplication(email: string): Promise<void> {
    const isMemberExists: boolean = await this.userRepository.exist({
      where: {
        email: email,
      },
    });
    if (isMemberExists) {
      throw new BadRequestException('이미 등록된 이메일입니다.');
    }
  }
}
