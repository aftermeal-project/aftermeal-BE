import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import tokenConfiguration from '@config/token.config';
import redisConfiguration from '@config/redis.config';
import { TokenService } from '../../../src/modules/token/application/services/token.service';
import { AccessTokenPayload } from '../../../src/modules/auth/domain/types/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { TOKEN_REPOSITORY } from '@common/constants/dependency-token';
import { TokenRepository } from '../../../src/modules/auth/domain/repositories/token.repository';
import { AuthModule } from '../../../src/modules/auth/auth.module';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let jwtConfig: ConfigType<typeof tokenConfiguration>;
  let tokenRepository: TokenRepository;
  let moduleRef: TestingModule;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    moduleRef = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [tokenConfiguration, redisConfiguration],
        }),
        AuthModule,
      ],
    }).compile();
    await moduleRef.init();

    tokenService = moduleRef.get(TokenService);
    jwtService = moduleRef.get(JwtService);
    tokenRepository = moduleRef.get(TOKEN_REPOSITORY);
    jwtConfig = moduleRef.get(tokenConfiguration.KEY);
    dataSource = moduleRef.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await moduleRef.close();
  });

  describe('generateAccessToken', () => {
    it('유효한 엑세스 토큰을 생성한다.', async () => {
      // given
      const payload = {
        sub: '1',
        username: 'test',
        email: 'test@example.com',
        roles: ['user'],
      };

      // when
      const result = tokenService.generateAccessToken(payload);

      // then
      expect(result).toBeDefined();

      const decoded: AccessTokenPayload = jwtService.verify(result, {
        secret: jwtConfig.accessToken.secret,
      });
      expect(decoded).toMatchObject(payload);
    });

    it('유효하지 않은 페이로드로 엑세스 토큰을 생성하면 에러가 발생합니다.', async () => {
      // given
      const payload = { hi: 'hi' };

      // when
      const result = () => {
        tokenService.generateAccessToken(payload as any);
      };

      // then
      expect(result).toThrow(IllegalArgumentException);
    });
  });

  describe('generateRefreshToken', () => {
    it('유효한 리프레시 토큰을 생성합니다.', async () => {
      // when
      const result = tokenService.generateRefreshToken();

      // then
      expect(result).toBeDefined();
    });
  });

  describe('saveRefreshToken', () => {
    it('리프레시 토큰을 저장합니다.', async () => {
      // given
      const userId = 1;
      const refreshToken = tokenService.generateRefreshToken();

      // when
      await tokenService.saveRefreshToken(refreshToken, userId);

      // then
      const storedUserId =
        await tokenRepository.findUserIdByRefreshToken(refreshToken);
      expect(storedUserId).toBe(1);
    });
  });
});
