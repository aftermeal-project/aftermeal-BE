import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { RoleModule } from '../role/role.module';
import { GenerationModule } from '../generation/generation.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, GenerationModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
