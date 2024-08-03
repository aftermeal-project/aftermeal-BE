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
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { Generation } from '../../src/modules/generation/domain/generation.entity';
import { UserRegisterRequestDTO } from '../../src/modules/user/presentation/dto/user-register.req.dto';

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
      const dto = new UserRegisterRequestDTO(
        '테스트',
        'test@example.com',
        UserType.TEACHER,
        'G$K9Vss9-wNX6jOvY',
      );
      const actual = await sut.register(dto);

      // then
      const user: User = await sut.getOneById(actual.id);
      expect(user.id).toBeDefined();
    });

    it('이미 등록된 이메일으로는 등록할 수 없다.', async () => {
      // given
      const email = 'test@example.com';

      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = User.createTeacher(
        '송유현',
        email,
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await userRepository.save(user);

      // when
      const dto = new UserRegisterRequestDTO(
        '테스트',
        email,
        UserType.TEACHER,
        'G$K9Vss9-wNX6jOvY',
      );
      const actual = async () => {
        await sut.register(dto);
      };

      // then
      await expect(actual).rejects.toThrow(IllegalArgumentException);
    });
  });
});
