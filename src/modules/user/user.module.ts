import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { RoleModule } from '../role/role.module';
import { GenerationModule } from '../generation/generation.module';
import { USER_REPOSITORY } from '@common/constants/dependency-token';
import { UserTypeormRepository } from './infrastructure/user-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, GenerationModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeormRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
