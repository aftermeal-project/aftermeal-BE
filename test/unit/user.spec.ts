import { UserType } from '../../src/modules/user/domain/user-type';
import { User } from '../../src/modules/user/domain/user.entity';
import { UserStatus } from '../../src/modules/user/domain/user-status';
import { Role } from '../../src/modules/user/domain/role.entity';
import { Generation } from '../../src/modules/generation/domain/generation.entity';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';

describe('User', () => {
  describe('create', () => {
    it('이름은 40자 이하여야 한다.', async () => {
      // when & then
      expect(() => {
        User.create(
          '테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트',
          'test@example.com',
          UserType.TEACHER,
          Role.create('ROLE_USER'),
          UserStatus.ACTIVATE,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 20자 이하여야 한다.', async () => {
      // when & then
      expect(() => {
        User.create(
          '테스트',
          'test@example.com',
          UserType.TEACHER,
          Role.create('ROLE_USER'),
          UserStatus.ACTIVATE,
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);

      expect(() => {
        User.create(
          '테스트',
          'test@example.com',
          UserType.TEACHER,
          Role.create('ROLE_USER'),
          UserStatus.ACTIVATE,
          'G$K9Vss9-wNX6jOvYG$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('사용자 유형이 학생인 경우, 기수가 존재해야 한다.', async () => {
      // when & then
      expect(() => {
        User.create(
          '테스트',
          's20041@gsm.hs.kr',
          UserType.STUDENT,
          Role.create('ROLE_USER'),
          UserStatus.ACTIVATE,
          'G$K9Vss9-wNX6jOvY',
        );
      }).toThrow(IllegalArgumentException);
    });

    it('사용자 유형이 학생인 경우, 학교 이메일을 사용해야 한다.', async () => {
      // given
      const generation = new Generation();

      // when & then
      expect(() => {
        User.create(
          '테스트',
          'test@example.com',
          UserType.STUDENT,
          Role.create('ROLE_USER'),
          UserStatus.ACTIVATE,
          'G$K9Vss9-wNX6jOvY',
          generation,
        );
      }).toThrow(IllegalArgumentException);
    });

    it('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 한다.', async () => {
      // when & then
      expect(() => {
        User.create(
          '테스트',
          'test@example.com',
          UserType.STUDENT,
          Role.create('ROLE_USER'),
          UserStatus.ACTIVATE,
          'password',
        );
      }).toThrow(IllegalArgumentException);
    });
  });

  describe('checkPassword', () => {
    it('비밀번호가 일치하지 않으면 IllegalArgumentException 가 반환된다.', async () => {
      // given
      const user: User = User.create(
        '테스트',
        'test@example.com',
        UserType.TEACHER,
        Role.create('ROLE_USER'),
        UserStatus.ACTIVATE,
        'G$K9Vss9-wNX6jOvY',
      );

      // when & then
      await expect(
        user.checkPassword('ThisIsInvalidPassword!'),
      ).rejects.toThrow(IllegalArgumentException);
    });
  });
});
