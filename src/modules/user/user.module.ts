import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { RoleModule } from '../role/role.module';
import { GenerationModule } from '../generation/generation.module';
import { USER_REPOSITORY } from '@common/constants/dependency-token';
import { UserTypeormRepository } from './infrastructure/persistence/user-typeorm.repository';
import { TokenModule } from '../token/token.module';
import { MailModule } from '@common/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    GenerationModule,
    TokenModule,
    MailModule,
  ],
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
