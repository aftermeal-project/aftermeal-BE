import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { Role } from '../../../src/modules/role/domain/entities/role.entity';
import { Generation } from '../../../src/modules/generation/domain/entities/generation.entity';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';

describe('User', () => {
  describe('createTeacher', () => {
    it('유효한 입력으로 교사 계정을 생성한다', async () => {
      // given
      const role: Role = Role.create('USER');

      // when
      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );

      // then
      expect(user).toBeDefined();
    });

    it('이름은 40자 이하여야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');

      // when & then
      expect(() => {
        User.createTeacher(
          '테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트',
          'test@example.com',
          role,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 20자 이하여야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');

      // when & then
      expect(() => {
        User.createTeacher(
          '테스트',
          'test@example.com',
          role,
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');

      // when & then
      expect(() => {
        User.createTeacher('테스트', 'test@example.com', role, 'password');
      }).toThrow(IllegalArgumentException);
    });
  });

  describe('createStudent', () => {
    it('유효한 입력으로 학생 계정을 생성한다', async () => {
      // given
      const role: Role = Role.create('USER');
      const generation: Generation = Generation.create(8, 2024, false);

      // when
      const user: User = User.createStudent(
        '테스트',
        's20041@gsm.hs.kr',
        role,
        generation,
        'G$K9Vss9-wNX6jOvY',
      );

      // then
      expect(user).toBeDefined();
    });

    it('이름은 40자 이하여야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      const generation: Generation = Generation.create(8, 2024, false);

      // when & then
      expect(() => {
        User.createStudent(
          '테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트',
          's20041@gsm.hs.kr',
          role,
          generation,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 20자 이하여야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      const generation: Generation = Generation.create(8, 2024, false);

      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          's20041@gsm.hs.kr',
          role,
          generation,
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      const generation: Generation = Generation.create(8, 2024, false);

      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          's20041@gsm.hs.kr',
          role,
          generation,
          'password',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('기수가 존재해야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');

      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          's20041@gsm.hs.kr',
          role,
          null,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('재학 중인 기수의 학생이어야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      const generation = Generation.create(1, 2018, true);

      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          's20041@gsm.hs.kr',
          role,
          generation,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('이메일은 학교 이메일이어야 한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      const generation: Generation = Generation.create(8, 2024, false);

      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          'test@example.com',
          role,
          generation,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });
  });

  describe('checkPassword', () => {
    it('잘못된 비밀번호 입력 시 로그인에 실패한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await user.hashPassword();

      // when & then
      await expect(
        user.checkPassword('ThisIsInvalidPassword!'),
      ).rejects.toThrow(IllegalArgumentException);
    });
  });

  describe('hashPassword', () => {
    it('사용자 비밀번호를 안전하게 저장한다.', async () => {
      // given
      const role: Role = Role.create('USER');

      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );

      // when
      await user.hashPassword();

      // then
      expect(user.password).not.toBe('G$K9Vss9-wNX6jOvY');
    });
  });
});
