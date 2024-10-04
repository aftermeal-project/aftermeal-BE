import { Generation } from '../entities/generation.entity';

export interface GenerationRepository {
  findOneByGenerationNumber(generationNumber: number): Promise<Generation>;
  deleteAll(): Promise<void>;
  save(generation: Generation): Promise<void>;
}
