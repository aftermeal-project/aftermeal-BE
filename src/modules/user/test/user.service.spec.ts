import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/user.service';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { MemberType } from '../domain/member-type';
import { Generation } from '../../generation/domain/generation.entity';
import { Role } from '../domain/role.entity';
import { ConflictException } from '@nestjs/common';
import { GenerationService } from '../../generation/application/generation.service';
import { UserRole } from '../domain/user-role.entity';
import { RoleService } from '../../role/application/role.service';

const mockUserRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  exist: jest.fn().mockReturnValue(false),
};
const mockGenerationService = {
  getOneByGenerationNumber: jest.fn(),
};
const mockRoleService = { getOneByName: jest.fn() };
const mockUserRoleRepository = { save: jest.fn() };
const mockDataSource = {
  createQueryRunner: jest.fn(() => mockQueryRunner()),
};
const mockQueryRunner = () => ({
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let generationService: GenerationService;
  let roleService: RoleService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: GenerationService,
          useValue: mockGenerationService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: mockUserRoleRepository,
        },
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    generationService = moduleRef.get<GenerationService>(GenerationService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    roleService = moduleRef.get<RoleService>(RoleService);
  });

  describe('register', () => {
    it('새로운 선생님이 등록한다.', async () => {
      const user: User = createTeacher();
      const role: Role = createMemberRole();

      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
      jest.spyOn(roleService, 'getOneByName').mockResolvedValueOnce(role);

      const result = await userService.register({
        email: user.email,
        name: user.name,
        memberType: user.memberType,
        password: user.password,
      });

      expect(result.id).toBe(user.id);
    });

    it('새로운 학생이 등록한다.', async () => {
      const user: User = createStudent();
      const role: Role = createMemberRole();

      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
      jest.spyOn(roleService, 'getOneByName').mockResolvedValueOnce(role);
      jest
        .spyOn(generationService, 'getOneByGenerationNumber')
        .mockResolvedValueOnce(user.generation);

      const result = await userService.register({
        email: user.email,
        name: user.name,
        memberType: user.memberType,
        password: user.password,
        generationNumber: user.generation.generationNumber,
      });

      expect(result.id).toBe(user.id);
    });
  });

  it('이미 등록된 이메일이 있다면 ConflictException을 반환해야 합니다.', async () => {
    const user: User = createTeacher();

    jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(true);

    const result = async () => {
      await userService.register({
        email: user.email,
        name: user.name,
        memberType: user.memberType,
        password: user.password,
      });
    };

    await expect(result).rejects.toThrow(ConflictException);
  });
});

function createTeacher(
  name = '테스트',
  email = 'test@example.com',
  memberType = MemberType.Teacher,
  password = 'G$K9Vss9-wNX6jOvY',
): User {
  const user: User = new User();
  user.id = 1;
  user.name = name;
  user.email = email;
  user.memberType = memberType;
  user.password = password;
  return user;
}

function createStudent(
  generation: Generation = {
    generationNumber: 8,
    isGraduated: false,
    yearOfAdmission: 2023,
  },
  name = '테스트',
  email = 's20041@gsm.hs.kr',
  memberType = MemberType.Student,
  password = 'G$K9Vss9-wNX6jOvY',
): User {
  const user: User = new User();
  user.id = 1;
  user.name = name;
  user.email = email;
  user.memberType = memberType;
  user.password = password;
  user.generation = generation;
  return user;
}

function createMemberRole(name = 'ROLE_MEMBER'): Role {
  const role: Role = new Role();
  role.id = 1;
  role.name = name;
  return role;
}
