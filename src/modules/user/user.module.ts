import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { RoleModule } from '../role/role.module';
import { GenerationModule } from '../generation/generation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserRole } from './domain/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole]),
    RoleModule,
    GenerationModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
