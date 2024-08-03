import { User } from '../../src/modules/user/domain/user.entity';
import { Role } from '../../src/modules/role/domain/role.entity';
import { Generation } from '../../src/modules/generation/domain/generation.entity';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';

describe('User', () => {
  describe('createTeacher', () => {
    it('이름은 40자 이하여야 한다.', async () => {
      // when & then
      expect(() => {
        User.createTeacher(
          '테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트',
          'test@example.com',
          Role.create('USER'),
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 20자 이하여야 한다.', async () => {
      // when & then
      expect(() => {
        User.createTeacher(
          '테스트',
          'test@example.com',
          Role.create('USER'),
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);

      expect(() => {
        User.createTeacher(
          '테스트',
          'test@example.com',
          Role.create('USER'),
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 한다.', async () => {
      // when & then
      expect(() => {
        User.createTeacher(
          '테스트',
          'test@example.com',
          Role.create('USER'),
          'password',
        );
      }).toThrow(IllegalArgumentException);
    });
  });

  describe('createStudent', () => {
    it('이름은 40자 이하여야 한다.', async () => {
      // given
      const generation = new Generation();

      // when & then
      expect(() => {
        User.createStudent(
          '테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트',
          'test@example.com',
          Role.create('USER'),
          generation,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });
    it('비밀번호는 20자 이하여야 한다.', async () => {
      // when & then
      expect(() => {
        User.createTeacher(
          '테스트',
          'test@example.com',
          Role.create('USER'),
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);

      expect(() => {
        User.createTeacher(
          '테스트',
          'test@example.com',
          Role.create('USER'),
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 한다.', async () => {
      // when & then
      expect(() => {
        User.createTeacher(
          '테스트',
          'test@example.com',
          Role.create('USER'),
          'password',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('기수가 존재해야 한다.', async () => {
      // when & then
      expect(() => {
        User.createTeacher(
          '테스트',
          's20041@gsm.hs.kr',
          Role.create('USER'),
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('재학 중인 기수의 학생이어야 한다.', async () => {
      // given
      const generation = Generation.create(1, 2018, false);

      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          'test@example.com',
          Role.create('USER'),
          generation,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('이메일은 학교 이메일이어야 한다.', async () => {
      // given
      const generation = new Generation();

      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          'test@example.com',
          Role.create('USER'),
          generation,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });
  });

  describe('checkPassword', () => {
    it('입력한 비밀번호가 등록된 비밀번호와 일치해야한다.', async () => {
      // given
      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        Role.create('USER'),
        'G$K9Vss9-wNX6jOvY',
      );

      // when & then
      await expect(
        user.checkPassword('ThisIsInvalidPassword!'),
      ).rejects.toThrow(IllegalArgumentException);
    });
  });

  describe('hashPassword', () => {
    it('비밀번호를 해싱한다.', async () => {
      // given
      const user: User = User.createTeacher(
        '테스트',
        '',
        Role.create('USER'),
        'G$K9Vss9-wNX6jOvY',
      );

      // when
      const actual = user.hashPassword();

      // then
      expect(actual).toBeDefined();
    });
  });
});
