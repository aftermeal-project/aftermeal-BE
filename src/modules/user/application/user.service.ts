import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { UserRole } from '../domain/user-role.entity';
import { Role } from '../domain/role.entity';
import { Generation } from '../../generation/domain/generation.entity';
import { MemberType } from '../domain/member-type';
import { UserRegisterResponseDto } from '../dto/user-register-response.dto';
import { UserRegisterRequestDto } from '../dto/user-register-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerationService } from '../../generation/application/generation.service';
import { RoleService } from '../../role/application/role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly roleService: RoleService,
    private readonly generationService: GenerationService,
  ) {}

  async register(
    dto: UserRegisterRequestDto,
  ): Promise<UserRegisterResponseDto> {
    await this.verifyEmailDuplication(dto.email);
    let generation: Generation | null = null;

    if (dto.memberType === MemberType.Student) {
      generation = await this.generationService.getOneByGenerationNumber(
        dto.generationNumber,
      );
      if (generation.isGraduated) {
        throw new BadRequestException('이미 졸업한 기수입니다.');
      }
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user: User = User.newMember(
        dto.name,
        dto.email,
        dto.password,
        dto.memberType,
        generation,
      );
      const savedUser: User = await this.userRepository.save(user);

      const role: Role | null = await this.roleService.getOneByName(
        'ROLE_MEMBER',
      );

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

  // async newCandidate(
  //   email: string,
  //   memberType: MemberType,
  //   generationNumber?: number | null,
  // ): Promise<User> {
  //   await this.verifyEmailDuplication(email);
  //   let generation: Generation | null = null;
  //
  //   if (memberType === MemberType.Student) {
  //     generation = await this.generationRepository.findOneBy({
  //       generationNumber: generationNumber,
  //     });
  //     this.checkGenerationExistence(generation);
  //     this.checkIfAlreadyGraduatedGeneration(generation);
  //   }
  //
  //   const candidateMember: User = User.newCandidate(
  //     email,
  //     memberType,
  //     generation,
  //   );
  //   const savedUser: User = await this.userRepository.save(candidateMember);
  //
  //   const role: Role | null = await this.roleRepository.findOneBy({
  //     name: 'ROLE_MEMBER',
  //   });
  //   this.checkRoleExistence(role);
  //
  //   const userRole: UserRole = new UserRole();
  //   userRole.role = role;
  //   userRole.user = savedUser;
  //   await this.userRoleRepository.save(userRole);
  //
  //   return savedUser;
  // }

  private async verifyEmailDuplication(email: string): Promise<void> {
    const isMemberExists: boolean = await this.userRepository.exist({
      where: {
        email: email,
      },
    });
    if (isMemberExists) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }
  }
}
