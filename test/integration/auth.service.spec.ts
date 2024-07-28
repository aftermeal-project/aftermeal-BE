import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../src/modules/user/domain/user.entity';
import { UserType } from '../../src/modules/user/domain/user-type';
import { UserRole } from '../../src/modules/role/domain/user-role.entity';
import { Role } from '../../src/modules/role/domain/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { UserStatus } from '../../src/modules/user/domain/user-status';
import { AuthService } from '../../src/modules/auth/application/auth.service';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import jwtConfiguration from '@config/jwt.config';

describe('AuthService', () => {
  let sut: AuthService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<UserRole>;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ConfigModule.forRoot({ load: [jwtConfiguration], isGlobal: true }),
        AuthModule,
      ],
    }).compile();

    sut = moduleRef.get(AuthService);
    userRepository = moduleRef.get(getRepositoryToken(User));
    roleRepository = moduleRef.get(getRepositoryToken(Role));
    userRoleRepository = moduleRef.get(getRepositoryToken(UserRole));
    dataSource = moduleRef.get(DataSource);
  });

  afterEach(async () => {
    await userRoleRepository.delete({});
    await roleRepository.delete({});
    await userRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('login', () => {
    it('유효한 정보를 통해 인증한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = createUser();
      await userRepository.save(user);

      // when
      const actual = await sut.login({
        email: 'test@example.com',
        password: 'G$K9Vss9-wNX6jOvY',
      });

      // then
      expect(actual.accessToken).toBeDefined();
      expect(actual.expiredIn).toBeDefined();
      expect(actual.tokenType).toBeDefined();
    });
  });
});

function createUser(): User {
  return User.create(
    '송유현',
    'test@example.com',
    UserType.TEACHER,
    Role.create('USER'),
    UserStatus.ACTIVATE,
    'G$K9Vss9-wNX6jOvY',
  );
}
