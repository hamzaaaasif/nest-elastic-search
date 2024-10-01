import {
  Controller,
  Get,
  Req,
  Logger,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { User } from './users.entity';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getUserById/:id')
  getUserById(@Req() req, @Param('id') id: string): Promise<User> | undefined {
    try {
      Logger.log(
        'user controller getUserById, reqUser ',
        JSON.stringify(req.user),
      );
      return this.userService.getUserById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
