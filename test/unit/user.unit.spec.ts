import { UserType } from '../../src/modules/user/domain/user-type';
import { User } from '../../src/modules/user/domain/user.entity';
import { UserStatus } from '../../src/modules/user/domain/user-status';
import { Role } from '../../src/modules/user/domain/role.entity';
import { Generation } from '../../src/modules/generation/domain/generation.entity';

describe('User (Unit)', () => {
  it('사용자 유형이 선생님인 사용자를 생성한다.', async () => {
    // when
    const actual = User.create(
      '테스트',
      'test@example.com',
      UserType.TEACHER,
      Role.create('ROLE_USER'),
      UserStatus.ACTIVATE,
      'password',
    );

    // then
    expect(actual).toBeInstanceOf(User);
  });

  it('사용자 유형이 학생인 사용자를 생성한다.', async () => {
    // given
    const generation = new Generation();

    // when
    const actual = User.create(
      '테스트',
      's20041@gsm.hs.kr',
      UserType.STUDENT,
      Role.create('ROLE_USER'),
      UserStatus.ACTIVATE,
      'password',
      generation,
    );

    // then
    expect(actual).toBeInstanceOf(User);
  });

  it('이름의 길이는 40 이하이여야 한다.', async () => {
    // when & then
    expect(() => {
      User.create(
        '타우마타와카탕이항아코아우아우오타마테아투리푸카카피키마웅아호로누쿠포카이웨누아키타나타후',
        'test@example.com',
        UserType.TEACHER,
        Role.create('ROLE_USER'),
        UserStatus.ACTIVATE,
        'password',
      );
    }).toThrowError('이름은 40자 이하여야 합니다.');
  });

  it('비밀번호의 길이는 20 이하이여야 한다.', async () => {
    // when & then
    expect(() => {
      User.create(
        '테스트',
        'test@example.com',
        UserType.TEACHER,
        Role.create('ROLE_USER'),
        UserStatus.ACTIVATE,
        'passwordpasswordpasswordpassword',
      );
    }).toThrowError('비밀번호는 20자 이하여야 합니다.');
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
        'password',
      );
    }).toThrowError('학생은 기수가 존재해야 합니다.');
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
        'password',
        generation,
      );
    }).toThrowError('학생은 학교 이메일을 사용해야 합니다.');
  });
});
