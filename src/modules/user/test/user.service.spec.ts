import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/user.service';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { MemberType } from '../domain/member-type';
import { Generation } from '../../generation/domain/generation.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { GenerationService } from '../../generation/application/generation.service';
import { UserRole } from '../domain/user-role.entity';
import { RoleService } from '../../role/application/role.service';
import { UserRegisterResponseDto } from '../dto/user-register-response.dto';

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
  });

  describe('register', () => {
    it('UserRegisterResponseDto를 반환해야 한다.', async () => {
      // given
      const user: User = new User();
      user.id = 1;
      user.name = '테스트';
      user.email = 'test@example.com';
      user.memberType = MemberType.Teacher;
      user.password = 'G$K9Vss9-wNX6jOvY';

      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);

      // when
      const result = await userService.register({
        email: user.email,
        name: user.name,
        memberType: user.memberType,
        password: user.password,
      });

      // then
      expect(result).toStrictEqual(UserRegisterResponseDto.from(user));
    });
  });

  it('이미 등록된 이메일이 있다면 ConflictException을 반환해야 한다.', async () => {
    // given
    const user: User = new User();
    user.id = 1;
    user.name = '테스트';
    user.email = 'test@example.com';
    user.memberType = MemberType.Teacher;
    user.password = 'G$K9Vss9-wNX6jOvY';

    jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(true);

    // when
    const result = async () => {
      await userService.register({
        name: user.name,
        email: user.email,
        memberType: user.memberType,
        password: user.password,
      });
    };

    // then
    await expect(result).rejects.toThrow(ConflictException);
  });

  it('학생이 졸업한 기수라면 BadRequestException을 반환해야 한다.', async () => {
    // given
    const generation: Generation = new Generation();
    generation.generationNumber = 1;
    generation.isGraduated = true;
    generation.yearOfAdmission = 2017;

    const user: User = new User();
    user.id = 1;
    user.name = '테스트';
    user.email = 's20041@gsm.hs.kr';
    user.memberType = MemberType.Student;
    user.password = 'G$K9Vss9-wNX6jOvY';
    user.generation = generation;

    jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);
    jest
      .spyOn(generationService, 'getOneByGenerationNumber')
      .mockResolvedValueOnce(generation);
    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);

    // when
    const result = async () => {
      await userService.register({
        name: user.name,
        email: user.email,
        memberType: user.memberType,
        password: user.password,
        generationNumber: user.generation.generationNumber,
      });
    };

    // then
    await expect(result).rejects.toThrow(BadRequestException);
  });
});
