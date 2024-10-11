import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
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
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async register(
    @Body() dto: UserRegistrationRequestDto,
  ): Promise<ResponseEntity<null>> {
    try {
      await this.userService.register(dto);
      return ResponseEntity.SUCCESS();
    } catch (error) {
      if (error instanceof IllegalArgumentException) {
        throw new BadRequestException(error);
      } else if (error instanceof IllegalStateException) {
        throw new BadRequestException(error);
      }
      if (error instanceof ResourceNotFoundException) {
        throw new NotFoundException(error);
      }
      if (error instanceof AlreadyExistException) {
        throw new ConflictException(error);
      }
      throw error;
    }
  }

  @Roles('ADMIN')
  @Get()
  async getAllUsers(): Promise<ResponseEntity<UserResponseDto[]>> {
    return ResponseEntity.SUCCESS(await this.userService.getAllUsers());
  }

  @Roles('ADMIN')
  @Patch(':userId')
  @HttpCode(204)
  async updateUserById(
    @Param('userId') userId: number,
    @Body() dto: UserUpdateRequestDto,
  ): Promise<void> {
    await this.userService.updateUserById(userId, dto);
  }

  @Roles('ADMIN')
  @Delete(':userId')
  @HttpCode(204)
  async deleteUserById(@Param('userId') userId: number): Promise<void> {
    await this.userService.deleteUserById(userId);
  }
}
