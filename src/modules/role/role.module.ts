import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../user/domain/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
})
export class RoleModule {}
