import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/entities/role.entity';
import { UserRole } from './domain/entities/user-role.entity';
import {
  ROLE_REPOSITORY,
  USER_ROLE_REPOSITORY,
} from '@common/constants/dependency-token';
import { RoleTypeormRepository } from './infrastructure/persistence/role-typeorm.repository';
import { UserRoleTypeormRepository } from './infrastructure/persistence/user-role-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole])],
  providers: [
    RoleService,
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleTypeormRepository,
    },
    {
      provide: USER_ROLE_REPOSITORY,
      useClass: UserRoleTypeormRepository,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
