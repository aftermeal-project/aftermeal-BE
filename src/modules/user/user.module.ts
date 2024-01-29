import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generation } from '../generation/domain/generation.entity';
import { User } from './domain/user.entity';
import { Role } from './domain/role.entity';
import { UserRole } from './domain/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Generation, User, Role, UserRole])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
