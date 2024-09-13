import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/modules/user/application/services/user.service';
import { DataSource } from 'typeorm';
import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { UserType } from '../../../src/modules/user/domain/types/user-type';
import { Role } from '../../../src/modules/role/domain/entities/role.entity';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { UserModule } from '../../../src/modules/user/user.module';
import { UserRegistrationRequestDto } from '../../../src/modules/user/presentation/dto/user-registration-request.dto';
import { UserRepository } from '../../../src/modules/user/domain/repositories/user.repository';
import {
  GENERATION_REPOSITORY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from '@common/constants/dependency-token';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { RoleRepository } from '../../../src/modules/role/domain/repositories/role.repository';
import { GenerationRepository } from '../../../src/modules/generation/domain/repositories/generation.repository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;
  let generationRepository: GenerationRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [getTestMysqlModule(), UserModule],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(USER_REPOSITORY);
    roleRepository = moduleRef.get<RoleRepository>(ROLE_REPOSITORY);
    generationRepository = moduleRef.get<GenerationRepository>(
      GENERATION_REPOSITORY,
    );
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await userRepository.deleteAll();
    await roleRepository.deleteAll();
    await generationRepository.deleteAll();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('register', () => {
    it('신규 사용자를 등록한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const dto = new UserRegistrationRequestDto();
      dto.name = '테스트';
      dto.email = 'test@example.com';
      dto.type = UserType.TEACHER;
      dto.password = 'G$K9Vss9-wNX6jOvY';

      // when
      await userService.register(dto);

      // then
      const user: User = await userService.getUserByEmail('test@example.com');
      expect(user).toBeDefined();
    });

    it('이미 등록된 이메일으로는 등록할 수 없다.', async () => {
      // given
      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const email = 'test@example.com';
      const user: User = User.createTeacher(
        '테스트',
        email,
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      const dto = {
        name: '테스트',
        email: email,
        type: UserType.TEACHER,
        password: 'G$K9Vss9-wNX6jOvY',
      } as UserRegistrationRequestDto;

      // when
      const result = async () => {
        await userService.register(dto);
      };

      // then
      await expect(result).rejects.toThrow(AlreadyExistException);
    });
  });
});
