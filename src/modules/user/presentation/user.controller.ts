import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterReqDto } from './dto/user-register.req.dto';
import { UserRegisterResDto } from './dto/user-register.res.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { UserService } from '../application/user.service';
import { Public } from '@common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async register(
    @Body() dto: UserRegisterReqDto,
  ): Promise<ResponseEntity<UserRegisterResDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '등록에 성공했습니다.',
      await this.userService.register(dto),
    );
  }
}
