import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { RoleService } from '../role/application/role.service';
import { GenerationService } from '../generation/application/generation.service';
import { Role } from './domain/role.entity';
import { Generation } from '../generation/domain/generation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Generation])],
  controllers: [UserController],
  providers: [UserService, RoleService, GenerationService],
  exports: [UserService],
})
export class UserModule {}
