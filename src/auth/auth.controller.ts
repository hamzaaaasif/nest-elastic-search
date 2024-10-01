import {
  Controller,
  Body,
  Post,
  Logger,
  Get,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { ICreateAccount } from 'common/helpers';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public() //for public  routes
  @Post('register')
  public async register(@Body() args): Promise<ICreateAccount> {
    const { email, password, name } = args;
    Logger.log('Auth controller register: %s', {
      email,
      name,
    });
    return this.userService.register(email, password, name);
  }

  @Public() //for public routes
  @Post('login')
  public async login(@Body() args) {
    try {
      const { email, password } = args;
      Logger.log('Auth controller login ', {
        email,
      });
      return this.authService.login(email, password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('GetUserFromToken')
  public async getUserFromToken(@Req() req) {
    try {
      Logger.debug(
        'auth controller, getUserFromToken: %s',
        JSON.stringify(req.user),
      );
      if (!req.user) {
        throw new HttpException(
          'Invalid user credentials',
          HttpStatus.NOT_FOUND,
        );
      }
      return this.userService.getUserById(req.user.id);
    } catch (error) {
      Logger.error('auth controller, getUserFromToken ==> ', error);
      throw new HttpException(
        'Error while getting user from token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
