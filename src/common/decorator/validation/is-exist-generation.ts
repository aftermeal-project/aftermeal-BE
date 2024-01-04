import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Generation } from '../../../modules/generation/domain/generation.entity';

@Injectable()
@ValidatorConstraint({ name: 'isExistGeneration', async: true })
export class IsExistGenerationConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(Generation)
    private readonly generationRepository: Repository<Generation>,
  ) {}
  async validate(generationNumber: number): Promise<boolean> {
    const generation: Generation = await this.generationRepository.findOne({
      where: {
        generationNumber: generationNumber,
      },
    });
    return !!generation;
  }

  defaultMessage(): string {
    return 'Generation must be exist';
  }
}

export function IsExistGeneration(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      validator: IsExistGenerationConstraint,
    });
  };
}
