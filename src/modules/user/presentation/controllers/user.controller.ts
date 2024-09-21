import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserRegistrationRequestDto } from '../dto/user-registration-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { UserService } from '../../application/services/user.service';
import { Public } from '@common/decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { Roles } from '@common/decorators/roles.decorator';

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
    return ResponseEntity.OK('사용자 등록에 성공했습니다.');
  }

  @Public()
  @Get()
  async getAllUsers(): Promise<ResponseEntity<UserResponseDto[]>> {
    return ResponseEntity.OK_WITH_DATA(
      '사용자 전체 조회에 성공했습니다.',
      await this.userService.getAllUsers(),
    );
  }

  @Roles('ADMIN')
  @Patch(':userId')
  async updateUserById(
    @Param('userId') userId: number,
    @Body() dto: UserUpdateRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.userService.updateUserById(userId, dto);
    return ResponseEntity.OK('사용자 수정에 성공했습니다.');
  }

  @Roles('ADMIN')
  @Delete(':userId')
  async deleteUserById(
    @Param('userId') userId: number,
  ): Promise<ResponseEntity<void>> {
    await this.userService.deleteUserById(userId);
    return ResponseEntity.OK('사용자 삭제에 성공했습니다.');
  }
}
