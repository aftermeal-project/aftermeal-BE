import { validateSync } from 'class-validator';
import { LocalDate } from '@js-joda/core';
import { ActivityCreationRequestDto } from '../../../src/modules/activity/presentation/dto/activity-creation-request.dto';
import { EActivityType } from '../../../src/modules/activity/domain/types/activity-type';

describe('ActivityCreationRequestDto', () => {
  it('유효한 데이터로 검증에 성공해야 한다.', () => {
    // given
    const dto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 10;
    dto.activityLocationId = 1;
    dto.type = EActivityType.LUNCH;
    dto.scheduledDate = LocalDate.now();

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBe(0);
  });

  it('제목은 필수값이어야 한다.', () => {
    // given
    const dto = new ActivityCreationRequestDto();
    dto.title = ''; // Invalid value
    dto.maxParticipants = 10;
    dto.activityLocationId = 1;
    dto.type = EActivityType.LUNCH;
    dto.scheduledDate = LocalDate.now();

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('최대 참가자 수는 양수여야 한다.', () => {
    // given
    const dto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 0; // Invalid value
    dto.activityLocationId = 1;
    dto.type = EActivityType.LUNCH;
    dto.scheduledDate = LocalDate.now();

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('maxParticipants');
  });

  it('활동 위치 ID는 양수여야 한다.', () => {
    // given
    const dto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 10;
    dto.activityLocationId = -1; // Invalid value
    dto.type = EActivityType.LUNCH;
    dto.scheduledDate = LocalDate.now();

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('activityLocationId');
  });

  it('활동 유형은 유효한 enum 값이어야 한다.', () => {
    // given
    const dto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 10;
    dto.activityLocationId = 1;
    dto.type = 'INVALID_TYPE' as unknown as EActivityType; // Invalid value
    dto.scheduledDate = LocalDate.now();

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('type');
  });

  it('예정 날짜는 유효한 LocalDate 형식이어야 한다.', () => {
    // given
    const dto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 10;
    dto.activityLocationId = 1;
    dto.type = EActivityType.LUNCH;
    dto.scheduledDate = null; // Invalid value

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('scheduledDate');
  });
});
