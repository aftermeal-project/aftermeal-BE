import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/modules/user/application/services/user.service';
import { DataSource } from 'typeorm';
import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { UserType } from '../../../src/modules/user/domain/entities/user-type';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { UserRegistrationRequestDto } from '../../../src/modules/user/presentation/dto/user-registration-request.dto';
import { UserRepository } from '../../../src/modules/user/domain/repositories/user.repository';
import {
  GENERATION_REPOSITORY,
  USER_REPOSITORY,
} from '@common/constants/dependency-token';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { GenerationRepository } from '../../../src/modules/generation/domain/repositories/generation.repository';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { Generation } from '../../../src/modules/generation/domain/entities/generation.entity';
import { UserUpdateRequestDto } from '../../../src/modules/user/presentation/dto/user-update-request.dto';
import { UserTypeormRepository } from '../../../src/modules/user/infrastructure/persistence/user-typeorm.repository';
import { GenerationModule } from '../../../src/modules/generation/generation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import tokenConfiguration from '@config/token.config';
import redisConfiguration from '@config/redis.config';
import { UserStatus } from '../../../src/modules/user/domain/entities/user-status';
import emailConfig from '@config/email.config';
import { AuthService } from '../../../src/modules/auth/application/services/auth.service';
import { Role } from '../../../src/modules/user/domain/entities/role';

describe('UserService', () => {
  let userService: UserService;
  let authService: AuthService;
  let userRepository: UserRepository;
  let generationRepository: GenerationRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [tokenConfiguration, redisConfiguration, emailConfig],
        }),
        TypeOrmModule.forFeature([User]),
        GenerationModule,
      ],
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useClass: UserTypeormRepository,
        },
        {
          provide: AuthService,
          useValue: {
            sendEmailVerification: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<UserRepository>(USER_REPOSITORY);
    generationRepository = moduleRef.get<GenerationRepository>(
      GENERATION_REPOSITORY,
    );
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await userRepository.deleteAll();
    await generationRepository.deleteAll();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('register', () => {
    it('신규 사용자를 등록한다.', async () => {
      // given
      const dto = new UserRegistrationRequestDto();
      dto.name = '테스트';
      dto.email = 'test@example.com';
      dto.type = UserType.TEACHER;
      dto.password = 'G$K9Vss9-wNX6jOvY';

      // when
      await userService.register(dto);

      // then
      const users: User[] = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].name).toBe('테스트');
      expect(users[0].email).toBe('test@example.com');
      expect(users[0].type).toBe('TEACHER');
      expect(users[0].status).toBe('CANDIDATE');
      expect(users[0].role).toBe('USER');
      expect(authService.sendEmailVerification).toBeCalledTimes(1);
    });

    it('이미 등록된 이메일으로는 등록할 수 없다.', async () => {
      // given
      const email: string = 'test@example.com';

      const user: User = User.createTeacher(
        '테스트',
        email,
        'G$K9Vss9-wNX6jOvY',
      );
      user.activate();
      await userRepository.save(user);

      const dto: UserRegistrationRequestDto = {
        name: '테스트',
        email: email,
        type: UserType.TEACHER,
        password: 'G$K9Vss9-wNX6jOvY',
      };

      // when
      const result = async () => {
        await userService.register(dto);
      };

      // then
      await expect(result).rejects.toThrow(AlreadyExistException);
    });

    it('후보자 상태의 사용자는 인증 메일을 보낸다.', async () => {
      // given
      const email: string = 'test@exmaple.com';

      const user: User = User.createTeacher(
        '테스트',
        email,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      const dto: UserRegistrationRequestDto = {
        name: '테스트',
        email: email,
        type: UserType.TEACHER,
        password: 'G$K9Vss9-wNX6jOvY',
      };

      // when
      await userService.register(dto);

      // then
      expect(authService.sendEmailVerification).toBeCalledTimes(1);
    });
  });

  describe('getAllUsers', () => {
    it('모든 사용자를 반환한다.', async () => {
      // given
      const generation: Generation = Generation.create(8, 2024, false);
      await generationRepository.save(generation);

      const student: User = User.createStudent(
        'test',
        's20041@gsm.hs.kr',
        generation,
        'G$K9Vss9-wNX6jOvY',
      );
      const teacher: User = User.createTeacher(
        'test',
        'test2@example.com',
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.saveAll([student, teacher]);

      // when
      const result = await userService.getAllUsers();

      // then
      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('s20041@gsm.hs.kr');
      expect(result[0].generationNumber).toBe(8);
      expect(result[0].role).toBe('USER');
      expect(result[1].email).toBe('test2@example.com');
      expect(result[1].generationNumber).toBeNull();
      expect(result[1].role).toBe('USER');
    });
  });

  describe('getUserById', () => {
    it('ID를 통해 사용자를 반환한다.', async () => {
      // given
      const user: User = User.createTeacher(
        'test',
        'test@example.com',
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      // when
      const result = await userService.getUserById(user.id);

      // then
      expect(result.id).toBe(user.id);
      expect(result.name).toBe('test');
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe('USER');
    });

    it('ID에 해당하는 사용자가 없을 경우 예외를 반환한다.', async () => {
      // when & then
      await expect(userService.getUserById(999999)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('사용자 정보를 수정한다.', async () => {
      // given
      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      const dto: UserUpdateRequestDto = {
        name: '감스트',
        type: UserType.TEACHER,
        role: Role.ADMIN,
        status: UserStatus.DEACTIVATED,
      };

      // when
      await userService.updateUser(user.id, dto);

      // then
      const updatedUser: User = await userRepository.findOneById(user.id);

      expect(updatedUser.name).toBe('감스트');
      expect(updatedUser.type).toBe(UserType.TEACHER);
      expect(updatedUser.role).toBe(Role.ADMIN);
      expect(updatedUser.status).toBe(UserStatus.DEACTIVATED);
    });
  });
});
