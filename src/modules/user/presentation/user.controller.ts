import { Body, Controller, Post } from '@nestjs/common';
import { UserRegistrationRequestDto } from './dto/user-registration-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { UserService } from '../application/user.service';
import { Public } from '@common/decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: '사용자 등록' })
  @ApiCreatedResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiConflictResponse({ description: 'Conflict' })
  async register(
    @Body() dto: UserRegistrationRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.userService.register(dto);
    return ResponseEntity.OK_WITH('사용자 등록에 성공했습니다.');
  }
}
