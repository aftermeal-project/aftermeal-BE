import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterRequestDTO } from './dto/user-register.req.dto';
import { UserRegisterResponseDTO } from './dto/user-register.res.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { UserService } from '../application/user.service';
import { Public } from '@common/decorators/public.decorator';
import { User } from '../domain/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async register(
    @Body() dto: UserRegisterRequestDTO,
  ): Promise<ResponseEntity<UserRegisterResponseDTO>> {
    const user: User = await this.userService.register(dto);
    return ResponseEntity.OK_WITH_DATA(
      '등록에 성공했습니다.',
      UserRegisterResponseDTO.from(user),
    );
  }
}
