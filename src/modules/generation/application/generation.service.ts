import { Injectable } from '@nestjs/common';
import { Generation } from '../domain/generation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GenerationService {
  constructor(
    @InjectRepository(Generation)
    private readonly generationRepository: Repository<Generation>,
  ) {}

  @Cron(CronExpression.EVERY_YEAR)
  async updateGeneration() {
    const thisYear: number = new Date().getFullYear();
    // TODO
  }
}
