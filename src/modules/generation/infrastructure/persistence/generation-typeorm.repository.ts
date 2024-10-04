import { GenerationRepository } from '../../domain/repositories/generation.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Generation } from '../../domain/entities/generation.entity';
import { Repository } from 'typeorm';

export class GenerationTypeormRepository implements GenerationRepository {
  constructor(
    @InjectRepository(Generation)
    private readonly repository: Repository<Generation>,
  ) {}

  async findOneByGenerationNumber(
    generationNumber: number,
  ): Promise<Generation | null> {
    return await this.repository.findOneBy({
      generationNumber: generationNumber,
    });
  }

  async save(generation: Generation): Promise<void> {
    await this.repository.save(generation);
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}
