import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserRegisterRequestDto } from '../dto/user-register-request.dto';
import { UserRegisterResponseDto } from '../dto/user-register-response.dto';
import { ResponseEntity } from '@common/entities/response.entity';
import { ValidationByMemberTypePipe } from '@common/pipes/validation-by-member-type.pipe';
import { UserService } from '../application/user.service';
import { Public } from '@common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async register(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        strictGroups: true,
      }),
      ValidationByMemberTypePipe,
    )
    dto: UserRegisterRequestDto,
  ): Promise<ResponseEntity<UserRegisterResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '등록에 성공했습니다.',
      await this.userService.register(dto),
    );
  }
}
