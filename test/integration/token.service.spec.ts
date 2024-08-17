import { Role } from '../../src/modules/role/domain/role.entity';
import { User } from '../../src/modules/user/domain/user.entity';
import { TokenRefreshResponseDto } from '../../src/modules/token/presentation/dto/token-refresh-response.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '@config/jwt.config';
import redisConfig from '@config/redis.config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenService } from '../../src/modules/token/application/token.service';
import { TokenModule } from '../../src/modules/token/token.module';

describe('TokenService', () => {
  // System Under Test
  let tokenService: TokenService;

  // Dependencies
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let moduleRef: TestingModule;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    moduleRef = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ConfigModule.forRoot({
          load: [jwtConfig, redisConfig],
          isGlobal: true,
        }),
        TokenModule,
      ],
    }).compile();
    await moduleRef.init();

    tokenService = moduleRef.get(TokenService);
    userRepository = moduleRef.get(getRepositoryToken(User));
    roleRepository = moduleRef.get(getRepositoryToken(Role));
    dataSource = moduleRef.get(DataSource);
  });

  afterEach(async () => {
    await roleRepository.delete({});
    await userRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
    await moduleRef.close();
  });

  describe('refresh', () => {
    it('유효한 토큰을 통해 갱신한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const email: string = 'test@example.com';
      const password: string = 'G$K9Vss9-wNX6jOvY';

      const user: User = User.createTeacher(
        '송유현',
        email,
        Role.create('USER'),
        password,
      );
      await user.hashPassword();
      await userRepository.save(user);

      const refreshToken: string = await tokenService.generateRefreshToken(
        user.id,
      );

      // when
      const actual: TokenRefreshResponseDto =
        await tokenService.refresh(refreshToken);

      // then
      expect(actual.accessToken).toBeDefined();
      expect(actual.expiredIn).toBeDefined();
      expect(actual.tokenType).toBeDefined();
      expect(actual.refreshToken).toBeDefined();
    });
  });
});
