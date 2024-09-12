import { Inject, Injectable } from '@nestjs/common';
import { Generation } from '../../domain/entities/generation.entity';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { GenerationRepository } from '../../domain/repositories/generation.repository';
import { GENERATION_REPOSITORY } from '@common/constants/dependency-token';

@Injectable()
export class GenerationService {
  constructor(
    @Inject(GENERATION_REPOSITORY)
    private readonly generationRepository: GenerationRepository,
  ) {}

  async getGenerationByGenerationNumber(
    generationNumber: number,
  ): Promise<Generation> {
    const generation: Generation | null =
      await this.generationRepository.findOneByGenerationNumber(
        generationNumber,
      );
    if (!generation) {
      throw new NotFoundException('존재하지 않는 기수입니다.');
    }
    return generation;
  }
}
