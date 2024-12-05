import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserRegistrationRequestDto } from '../dto/user-registration-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { UserService } from '../../application/services/user.service';
import { Public } from '@common/decorators/public.decorator';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '../../domain/entities/role';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async register(
    @Body() dto: UserRegistrationRequestDto,
  ): Promise<ResponseEntity<null>> {
    await this.userService.register(dto);
    return ResponseEntity.SUCCESS();
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers(): Promise<ResponseEntity<UserResponseDto[]>> {
    return ResponseEntity.SUCCESS(await this.userService.getAllUsers());
  }

  @Roles(Role.ADMIN)
  @Patch(':userId')
  @HttpCode(204)
  async updateUserById(
    @Param('userId') userId: number,
    @Body() dto: UserUpdateRequestDto,
  ): Promise<void> {
    await this.userService.updateUser(userId, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':userId')
  @HttpCode(204)
  async deleteUserById(@Param('userId') userId: number): Promise<void> {
    await this.userService.deleteUser(userId);
  }
}
