import { Module } from '@nestjs/common';
import { RoleService } from './application/services/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/entities/role.entity';
import { ROLE_REPOSITORY } from '@common/constants/dependency-token';
import { RoleTypeormRepository } from './infrastructure/persistence/role-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [
    RoleService,
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleTypeormRepository,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
