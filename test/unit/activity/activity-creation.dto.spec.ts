import { validateSync } from 'class-validator';
import { LocalDate } from '@js-joda/core';
import { ActivityCreationRequestDto } from '../../../src/modules/activity/presentation/dto/activity-creation-request.dto';
import { EActivityType } from '../../../src/modules/activity/domain/entities/activity-type';

describe('ActivityCreationRequestDto', () => {
  it('제목은 빈칸이여선 안된다.', () => {
    // given
    const dto: ActivityCreationRequestDto = new ActivityCreationRequestDto();
    dto.title = '';
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

  it('최대 수용 인원은 최소 1 이상이어야 한다.', () => {
    // given
    const dto: ActivityCreationRequestDto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 0;
    dto.activityLocationId = 1;
    dto.type = EActivityType.LUNCH;
    dto.scheduledDate = LocalDate.now();

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('maxParticipants');
  });

  it('활동 위치 ID는 정수여야 한다.', () => {
    // given
    const dto: ActivityCreationRequestDto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 10;
    dto.activityLocationId = 1.1;
    dto.type = EActivityType.LUNCH;
    dto.scheduledDate = LocalDate.now();

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('activityLocationId');
  });

  it('활동 유형은 유효한 값이어야 한다.', () => {
    // given
    const dto: ActivityCreationRequestDto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 10;
    dto.activityLocationId = 1;
    dto.type = 'INVALID_TYPE' as any;
    dto.scheduledDate = LocalDate.now();

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('type');
  });

  it('예정 날짜는 유효한 LocalDate 형식이어야 한다.', () => {
    // given
    const dto: ActivityCreationRequestDto = new ActivityCreationRequestDto();
    dto.title = '테스트 활동';
    dto.maxParticipants = 10;
    dto.activityLocationId = 1;
    dto.type = EActivityType.LUNCH;
    dto.scheduledDate = null;

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('scheduledDate');
  });
});
