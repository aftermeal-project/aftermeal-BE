import { Inject, Injectable } from '@nestjs/common';
import { Participation } from '../../domain/entities/participation.entity';
import { ParticipationRepository } from '../../domain/entities/participation.repository';
import { PARTICIPATION_REPOSITORY } from '@common/constants/dependency-token';
import { NotFoundException } from '@common/exceptions/not-found.exception';

@Injectable()
export class ParticipationAdminService {
  constructor(
    @Inject(PARTICIPATION_REPOSITORY)
    private readonly participationRepository: ParticipationRepository,
  ) {}

  async getParticipationById(participationId: number): Promise<Participation> {
    const participation: Participation | null =
      await this.participationRepository.findOneById(participationId);

    if (!participation) {
      throw new NotFoundException('존재하지 않는 참가 정보입니다.');
    }

    return participation;
  }

  async cancelParticipation(participationId: number): Promise<void> {
    const participation: Participation =
      await this.getParticipationById(participationId);
    await this.participationRepository.delete(participation);
  }
}
