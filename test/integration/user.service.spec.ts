import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/modules/user/application/user.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../src/modules/user/domain/user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserType } from '../../src/modules/user/domain/user-type';
import { UserRole } from '../../src/modules/role/domain/user-role.entity';
import { Role } from '../../src/modules/role/domain/role.entity';
import { getTestMysqlModule } from '../get-test-mysql.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { UserModule } from '../../src/modules/user/user.module';
import { UserStatus } from '../../src/modules/user/domain/user-status';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { Generation } from '../../src/modules/generation/domain/generation.entity';

describe('UserService', () => {
  let sut: UserService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<UserRole>;
  let generationRepository: Repository<Generation>;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        UserModule,
        TypeOrmModule.forFeature([UserRole]),
      ],
    }).compile();

    sut = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    userRoleRepository = moduleRef.get<Repository<UserRole>>(
      getRepositoryToken(UserRole),
    );
    roleRepository = moduleRef.get<Repository<Role>>(getRepositoryToken(Role));
    generationRepository = moduleRef.get<Repository<Generation>>(
      getRepositoryToken(Generation),
    );
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await userRoleRepository.delete({});
    await userRepository.delete({});
    await roleRepository.delete({});
    await generationRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('register', () => {
    it('신규 사용자를 등록한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      // when
      const actual = await sut.register({
        name: '테스트',
        email: 'test@example.com',
        userType: UserType.TEACHER,
        password: 'G$K9Vss9-wNX6jOvY',
      });

      // then
      const user: User = await sut.getOneById(actual.id);
      expect(user.id).toBeDefined();
    });

    it('이미 등록된 이메일으로는 등록할 수 없다.', async () => {
      // given
      const email = 'test@example.com';

      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = User.create(
        '송유현',
        email,
        UserType.TEACHER,
        role,
        UserStatus.ACTIVATE,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      // when
      const actual = async () => {
        await sut.register({
          name: '테스트',
          email: email,
          userType: UserType.TEACHER,
          password: 'G$K9Vss9-wNX6jOvY',
        });
      };

      // then
      await expect(actual).rejects.toThrow(IllegalArgumentException);
    });

    it('졸업한 기수는 등록할 수 없다.', async () => {
      // given
      const generation = Generation.create(1, 2024, true);
      await generationRepository.save(generation);

      // when
      const actual = async () => {
        await sut.register({
          name: '테스트',
          email: 'test@example.com',
          userType: UserType.STUDENT,
          password: 'G$K9Vss9-wNX6jOvY',
          generationNumber: 1,
        });
      };

      // then
      await expect(actual).rejects.toThrow(IllegalArgumentException);
    });
  });
});
