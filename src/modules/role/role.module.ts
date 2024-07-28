import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
