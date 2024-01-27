import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../domain/user-role.entity';
import { Role } from '../domain/role.entity';
import { Generation } from '../../generation/domain/generation.entity';
import { MemberType } from '../domain/member-type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Generation)
    private readonly generationRepository: Repository<Generation>,
  ) {}

  async newCandidate(
    email: string,
    memberType: MemberType,
    generationNumber?: number | null,
  ): Promise<User> {
    let generation: Generation | null = null;

    if (memberType === MemberType.Student) {
      generation = await this.generationRepository.findOneBy({
        generationNumber: generationNumber,
      });
      this.checkExistGeneration(generation);
      this.checkIfAlreadyGraduated(generation);
    }

    const candidateMember: User = User.newCandidate(
      email,
      memberType,
      generation,
    );
    await this.checkExistMember(candidateMember);
    const savedUser: User = await this.userRepository.save(candidateMember);

    const role: Role | null = await this.roleRepository.findOneBy({
      name: 'ROLE_MEMBER',
    });
    this.checkExistRole(role);

    const userRole: UserRole = new UserRole();
    userRole.role = role;
    userRole.user = savedUser;
    await this.userRoleRepository.save(userRole);

    return savedUser;
  }

  private checkExistGeneration(generation: Generation | null): void {
    if (!generation) {
      throw new BadRequestException('존재하지 않는 기수입니다.');
    }
  }

  private checkIfAlreadyGraduated(generation: Generation): void {
    if (generation.isGraduated) {
      throw new BadRequestException('이미 졸업한 기수입니다.');
    }
  }

  private async checkExistMember(user: User): Promise<void> {
    const existMember: boolean = await this.userRepository.exist({
      where: {
        email: user.email,
      },
    });
    if (existMember) {
      throw new BadRequestException('이미 등록된 이메일입니다.');
    }
  }

  private checkExistRole(role: Role | null): void {
    if (!role) {
      throw new BadRequestException('존재하지 않는 권한입니다.');
    }
  }
}
