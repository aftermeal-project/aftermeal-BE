import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { Generation } from '../../../src/modules/generation/domain/entities/generation.entity';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { UserStatus } from '../../../src/modules/user/domain/entities/user-status';
import { UserType } from '../../../src/modules/user/domain/entities/user-type';

describe('User', () => {
  describe('createTeacher', () => {
    it('이름은 40자 이하여야 한다.', async () => {
      // when & then
      expect(() => {
        User.createTeacher(
          '테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트',
          'test@example.com',
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
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 한다.', async () => {
      // when & then
      expect(() => {
        User.createTeacher('테스트', 'test@example.com', 'password');
      }).toThrow(IllegalArgumentException);
    });
  });

  describe('createStudent', () => {
    it('기수가 존재해야 한다.', async () => {
      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          's20041@gsm.hs.kr',
          null,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('재학 중인 기수의 학생이어야 한다.', async () => {
      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          's20041@gsm.hs.kr',
          Generation.create(1, 2018, true),
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('이메일은 학교 이메일이어야 한다.', async () => {
      // when & then
      expect(() => {
        User.createStudent(
          '테스트',
          'test@example.com',
          Generation.create(8, 2024, false),
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });
  });

  describe('checkPassword', () => {
    it('올바른 비밀번호 입력 시 true를 반환한다.', async () => {
      // given
      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        'G$K9Vss9-wNX6jOvY',
      );
      await user.hashPassword();

      // when
      const result = await user.isPasswordValid('G$K9Vss9-wNX6jOvY');

      // then
      expect(result).toBe(true);
    });

    it('잘못된 비밀번호 입력 시 false를 반환한다.', async () => {
      // given
      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        'G$K9Vss9-wNX6jOvY',
      );
      await user.hashPassword();

      // when
      const result = await user.isPasswordValid('wrong-password');

      // then
      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('사용자 비밀번호를 안전하게 저장한다.', async () => {
      // given
      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        'G$K9Vss9-wNX6jOvY',
      );

      // when
      await user.hashPassword();

      // then
      expect(user.password).not.toBe('G$K9Vss9-wNX6jOvY');
    });
  });

  describe('update', () => {
    it('사용자 정보를 업데이트한다.', async () => {
      // given
      const user: User = User.createTeacher(
        '테스트',
        'test@example.com',
        'G$K9Vss9-wNX6jOvY',
      );

      // when
      user.update('테스트2', undefined, UserStatus.DEACTIVATED);

      // then
      expect(user.name).toBe('테스트2');
      expect(user.type).toBe(UserType.TEACHER);
      expect(user.status).toBe(UserStatus.DEACTIVATED);
    });
  });
});
