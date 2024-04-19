import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { RoleModule } from '../role/role.module';
import { GenerationModule } from '../generation/generation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, GenerationModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
