import { Role } from '../../src/modules/role/domain/role.entity';
import { User } from '../../src/modules/user/domain/user.entity';
import { TokenRefreshResponseDto } from '../../src/modules/auth/presentation/dto/token-refresh-response.dto';
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
import { TokenService } from '../../src/modules/auth/application/token.service';
import { AuthModule } from '../../src/modules/auth/auth.module';

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
        AuthModule,
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

  describe('generateAccessToken', () => {
    it('should generate access token', async () => {
      // given
      const user = new User();
      user.email = '';
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token', async () => {
      // given
      const user = new User();
      user.email = '';
    });
  });
});
