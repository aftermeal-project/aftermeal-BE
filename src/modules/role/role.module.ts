import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/role.entity';
import { UserRole } from './domain/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
