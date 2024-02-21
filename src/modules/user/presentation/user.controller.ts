import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterRequestDto } from '../dto/user-register-request.dto';
import { UserRegisterResponseDto } from '../dto/user-register-response.dto';
import { ResponseEntity } from '@common/model/response.entity';
import { ValidationByMemberTypePipe } from '@common/pipe/validation-by-member-type.pipe';
import { UserService } from '../application/user.service';
import { Public } from '@common/decorator/public.decorator';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async register(
    @Body(ValidationByMemberTypePipe)
    dto: UserRegisterRequestDto,
  ): Promise<ResponseEntity<UserRegisterResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '등록 성공',
      await this.userService.register(dto),
    );
  }
}
