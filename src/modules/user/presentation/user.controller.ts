import { Body, Controller, Post } from '@nestjs/common';
import { UserRegistrationRequestDto } from './dto/user-registration-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { UserService } from '../application/user.service';
import { Public } from '@common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async register(
    @Body() dto: UserRegistrationRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.userService.register(dto);
    return ResponseEntity.OK_WITH('등록에 성공했습니다.');
  }
}
