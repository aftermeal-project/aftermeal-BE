import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/user.service';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MemberType } from '../domain/member-type';
import { Generation } from '../../generation/domain/generation.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { GenerationService } from '../../generation/application/generation.service';
import { RoleService } from '../../role/application/role.service';
import { UserRegisterResponseDto } from '../dto/user-register-response.dto';
import { UserRole } from '../domain/user-role.entity';
import { UserRegisterRequestDto } from '../dto/user-register-request.dto';

const mockUserRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  exist: jest.fn().mockReturnValue(false),
};
const mockUserRoleRepository = {
  save: jest.fn(),
};
const mockGenerationService = {
  getOneByGenerationNumber: jest.fn(),
};
const mockRoleService = { getOneByName: jest.fn() };
jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('UserService', () => {
  let sut: UserService;
  let generationService: GenerationService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: mockUserRoleRepository,
        },
        {
          provide: GenerationService,
          useValue: mockGenerationService,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
      ],
    }).compile();

    sut = moduleRef.get<UserService>(UserService);
    generationService = moduleRef.get<GenerationService>(GenerationService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('register', () => {
    it('성공하면 UserRegisterResponseDto를 반환해야 한다.', async () => {
      const savedUser: User = new User();
      savedUser.id = 1;

      jest
        .spyOn(userRepository, 'save')
        .mockImplementation(async () => savedUser);

      // when
      const request = new UserRegisterRequestDto();
      const actual = await sut.register(request);

      // then
      const user = new User();
      user.id = 1;
      expect(actual).toStrictEqual(UserRegisterResponseDto.from(user));
    });

    it('이미 등록된 이메일이 있다면 ConflictException을 반환해야 한다.', async () => {
      // given
      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(true);

      // when
      const actual = async () => {
        await sut.register({
          name: '테스트',
          email: 'test@example.com',
          memberType: MemberType.Teacher,
          password: 'password',
        });
      };

      // then
      await expect(actual).rejects.toThrow(ConflictException);
    });

    it('학생이 졸업한 기수라면 BadRequestException을 반환해야 한다.', async () => {
      // given
      const generation: Generation = Generation.create(1, 2017, true);

      jest
        .spyOn(generationService, 'getOneByGenerationNumber')
        .mockResolvedValueOnce(generation);

      // when
      const request = new UserRegisterRequestDto();
      request.memberType = MemberType.Student;
      const actual = async () => {
        await sut.register(request);
      };

      // then
      await expect(actual).rejects.toThrow(BadRequestException);
    });
  });
});
