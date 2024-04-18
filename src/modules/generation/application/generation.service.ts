import { Injectable, NotFoundException } from '@nestjs/common';
import { Generation } from '../domain/generation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenerationService {
  constructor(
    @InjectRepository(Generation)
    private readonly generationRepository: Repository<Generation>,
  ) {}

  async getOneByGenerationNumber(
    generationNumber: number,
  ): Promise<Generation> {
    const generation: Generation | null =
      await this.generationRepository.findOneBy({
        generationNumber: generationNumber,
      });
    if (!generation) {
      throw new NotFoundException('존재하지 않는 기수입니다.');
    }
    return generation;
  }

  // @Cron(CronExpression.EVERY_YEAR)
  // async updateGeneration() {
  //   const thisYear: number = new Date().getFullYear();
  // }
}
