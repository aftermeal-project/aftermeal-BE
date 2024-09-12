import { Controller, Delete, Param } from '@nestjs/common';
import { ParticipationAdminService } from '../../application/services/participation-admin.service';
import { ResponseEntity } from '@common/models/response.entity';

@Controller()
export class ParticipationAdminController {
  constructor(
    private readonly participationAdminService: ParticipationAdminService,
  ) {}

  @Delete('participations/:participationId')
  async deleteParticipation(
    @Param() participationId: number,
  ): Promise<ResponseEntity<void>> {
    await this.participationAdminService.cancelParticipation(participationId);
    return ResponseEntity.OK('참가 신청이 취소되었습니다.');
  }
}
