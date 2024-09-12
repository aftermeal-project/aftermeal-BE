import { Module } from '@nestjs/common';
import { GenerationService } from './application/services/generation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generation } from './domain/entities/generation.entity';
import { GenerationTypeormRepository } from './infrastructure/persistence/generation-typeorm.repository';
import { GENERATION_REPOSITORY } from '@common/constants/dependency-token';

@Module({
  imports: [TypeOrmModule.forFeature([Generation])],
  providers: [
    GenerationService,
    {
      provide: GENERATION_REPOSITORY,
      useClass: GenerationTypeormRepository,
    },
  ],
  exports: [GenerationService],
})
export class GenerationModule {}
