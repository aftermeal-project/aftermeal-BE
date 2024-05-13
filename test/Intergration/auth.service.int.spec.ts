import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../src/modules/user/domain/user.entity';
import { EUserType } from '../../src/modules/user/domain/user-type';
import { UserRole } from '../../src/modules/user/domain/user-role.entity';
import { Role } from '../../src/modules/user/domain/role.entity';
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

describe('AuthService (Integration)', () => {
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
        ConfigModule.forRoot({
          envFilePath:
            process.env.NODE_ENV == 'production'
              ? '.env.production'
              : '.env.development',
        }),
        AuthModule,
      ],
    }).compile();

    sut = moduleRef.get(AuthService);
    userRepository = moduleRef.get(getRepositoryToken(User));
    roleRepository = moduleRef.get(getRepositoryToken(Role));
    userRoleRepository = moduleRef.get(getRepositoryToken(UserRole));
    dataSource = moduleRef.get(DataSource);
  });

  beforeEach(async () => {
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
      const role: Role = roleRepository.create({
        name: 'ROLE_MEMBER',
      });
      await roleRepository.save(role);

      const user: User = User.create(
        '송유현',
        'test@example.com',
        EUserType.TEACHER,
        role,
        UserStatus.Activate,
        'password',
      );
      await userRepository.save(user);

      // when
      const actual = await sut.login({
        email: 'test@example.com',
        password: 'password',
      });

      // then
      expect(actual.accessToken).toBeDefined();
      expect(actual.expiredIn).toBeDefined();
      expect(actual.tokenType).toBeDefined();
    });
  });

  it('등록되지 않은 이메일이면 오류가 발생한다.', async () => {
    // when
    const actual = async () => {
      await sut.login({
        email: 'test@example.com',
        password: 'password',
      });
    };

    // then
    await expect(actual).rejects.toThrowError(
      new NotFoundException('존재하지 않는 사용자입니다.'),
    );
  });

  it('비밀번호가 일치하지 않을 경우 인증에 실패해야 합니다.', async () => {
    // given
    const role: Role = roleRepository.create({
      name: 'ROLE_MEMBER',
    });
    await roleRepository.save(role);

    const user: User = User.create(
      '송유현',
      'test@example.com',
      EUserType.TEACHER,
      role,
      UserStatus.Activate,
      'password',
    );
    await userRepository.save(user);

    // when
    const actual = async () => {
      await sut.login({
        email: 'test@example.com',
        password: 'hi',
      });
    };

    // then
    await expect(actual).rejects.toThrowError(
      new BadRequestException('비밀번호가 올바르지 않습니다.'),
    );
  });
});
