import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { User } from '../users/users.entity';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async validateUser(email): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(email, password) {
    try {
      Logger.log('Auth service, login ');
      const user = await this.userService.userLogin(email);
      Logger.debug('Auth service, userLogin:', JSON.stringify(user));
      if (!user) {
        Logger.error('User not found');
        throw new HttpException(
          'Email or password is not correct',
          HttpStatus.NOT_FOUND,
        );
      }
      Logger.log('comparing user password');
      const checkPass = await this.comparePassword(user.password, password);
      if (!checkPass) {
        Logger.error('Password is not matched');
        throw new HttpException(
          'Email or password is not correct',
          HttpStatus.UNAUTHORIZED,
        );
      }
      Logger.log('signing user JWT token');
      const token = this.jwtService.sign(user.email);
      delete user['password'];
      return { user, token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async comparePassword(userPassword, enteredPassword) {
    return await compare(enteredPassword, userPassword);
  }
}
