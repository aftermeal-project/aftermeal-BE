import { Module } from '@nestjs/common';
import { SignUpController } from './presentation/sign-up.controller';
import { UserService } from './application/user.service';
import { SignUpService } from './application/sign-up.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generation } from '../generation/domain/generation.entity';
import { User } from './domain/user.entity';
import { Role } from './domain/role.entity';
import { UserRole } from './domain/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Generation, User, Role, UserRole])],
  controllers: [SignUpController],
  providers: [SignUpService, UserService],
  exports: [UserService],
})
export class UserModule {}
