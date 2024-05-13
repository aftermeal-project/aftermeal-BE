import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/modules/user/application/user.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../../src/modules/user/domain/user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EUserType } from '../../../src/modules/user/domain/user-type';
import { ConflictException } from '@nestjs/common';
import { UserRole } from '../../../src/modules/user/domain/user-role.entity';
import { Role } from '../../../src/modules/user/domain/role.entity';
import { getTestMysqlModule } from '../../get-test-mysql.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { UserModule } from '../../../src/modules/user/user.module';

describe('UserService (Integration)', () => {
  let sut: UserService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<UserRole>;
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
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await userRoleRepository.delete({});
    await userRepository.delete({});
    await roleRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('register', () => {
    it('새로운 사용자를 등록할 수 있다.', async () => {
      // given
      const role: Role = Role.create('ROLE_MEMBER');
      await roleRepository.save(role);

      // when
      const actual = await sut.register({
        name: '테스트',
        email: 'test@example.com',
        memberType: EUserType.TEACHER,
        password: 'password',
      });

      // then
      await expect(actual.id).toBeDefined();
    });

    it('이미 등록된 이메일은 가입할 수 없다.', async () => {
      // given
      const role: Role = Role.create('ROLE_MEMBER');
      await roleRepository.save(role);

      // when
      await sut.register({
        name: '테스트',
        email: 'test@example.com',
        memberType: EUserType.TEACHER,
        password: 'password',
      });
      const actual = async () => {
        await sut.register({
          name: '테스트',
          email: 'test@example.com',
          memberType: EUserType.TEACHER,
          password: 'password',
        });
      };

      // then
      await expect(actual).rejects.toThrowError(
        new ConflictException('이미 등록된 이메일입니다.'),
      );
    });
  });
});
