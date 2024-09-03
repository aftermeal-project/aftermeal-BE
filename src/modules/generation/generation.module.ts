import { Module } from '@nestjs/common';
import { GenerationService } from './application/generation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generation } from './domain/entities/generation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Generation])],
  providers: [GenerationService],
  exports: [GenerationService],
})
export class GenerationModule {}
