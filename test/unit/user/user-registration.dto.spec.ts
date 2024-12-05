import { validateSync } from 'class-validator';
import { UserRegistrationRequestDto } from '../../../src/modules/user/presentation/dto/user-registration-request.dto';
import { UserType } from '../../../src/modules/user/domain/entities/user-type';

describe('UserRegistrationRequestDto', () => {
  it('유효한 데이터로 검증에 성공해야 한다.', () => {
    // given
    const dto = new UserRegistrationRequestDto();
    dto.name = '테스트';
    dto.email = 'test@example.com';
    dto.type = UserType.STUDENT;
    dto.generationNumber = 1;
    dto.password = 'G$K9Vss9-wNX6jOvY';

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBe(0);
  });

  it('이름은 필수값이어야 한다.', () => {
    // given
    const dto = new UserRegistrationRequestDto();
    dto.name = ''; // Invalid value
    dto.email = 'test@example.com';
    dto.type = UserType.STUDENT;
    dto.generationNumber = 1;
    dto.password = 'G$K9Vss9-wNX6jOvY';

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('이메일은 이메일 형식이어야 한다.', () => {
    // given
    const dto = new UserRegistrationRequestDto();
    dto.name = '테스트';
    dto.email = 'invalid-email'; // Invalid value
    dto.type = UserType.STUDENT;
    dto.generationNumber = 1;
    dto.password = 'G$K9Vss9-wNX6jOvY';

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('사용자 유형은 유효한 enum 값이어야 한다.', () => {
    // given
    const dto = new UserRegistrationRequestDto();
    dto.name = '테스트';
    dto.email = 'test@example.com';
    dto.type = 'INVALID_TYPE' as UserType; // Invalid value
    dto.generationNumber = 1;
    dto.password = 'G$K9Vss9-wNX6jOvY';

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('type');
  });

  it('기수 번호는 양수여야 한다.', () => {
    // given
    const dto = new UserRegistrationRequestDto();
    dto.name = '테스트';
    dto.email = 'test@example.com';
    dto.type = UserType.STUDENT;
    dto.generationNumber = -1; // Invalid value
    dto.password = 'G$K9Vss9-wNX6jOvY';

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('generationNumber');
  });

  it('기수 번호가 없을 경우에도 검증에 성공해야 한다.', () => {
    // given
    const dto = new UserRegistrationRequestDto();
    dto.name = '테스트';
    dto.email = 'test@example.com';
    dto.type = UserType.STUDENT;
    dto.password = 'G$K9Vss9-wNX6jOvY';
    dto.generationNumber = undefined;

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBe(0);
  });

  it('비밀번호는 필수값이어야 한다.', () => {
    // given
    const dto = new UserRegistrationRequestDto();
    dto.name = '테스트';
    dto.email = 'test@example.com';
    dto.type = UserType.STUDENT;
    dto.generationNumber = 1;
    dto.password = '';

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
});
