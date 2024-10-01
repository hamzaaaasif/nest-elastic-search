import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { ICreateAccount } from 'common/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<ICreateAccount> {
    Logger.debug('register function for creating user: %s', {
      email,
      name,
    });
    try {
      const findUser = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      Logger.debug('user service, register: %s', JSON.stringify(findUser));
      if (findUser) {
        Logger.error(
          'Error, user already exsist: %s',
          JSON.stringify(findUser),
        );
        throw new HttpException('User already exsits', HttpStatus.BAD_REQUEST);
      }
      Logger.debug('Creating new user: %s', { email });
      const user: User = new User();
      user.email = email;
      user.password = password;
      user.name = name;

      await this.userRepository.save(user);
      Logger.log('User registered');
      const token = this.jwtService.sign(user.email);
      Logger.debug('returning user and token: %s', {
        user,
        token,
      });
      Logger.log('Deleting extra information');

      delete user[password];
      return { user, token };
    } catch (error) {
      Logger.error('user service, register error ', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByEmail(email: string) {
    Logger.log('UserService finding user by email ', email);
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        select: ['createdAt', 'id', 'name', 'email'],
      });
      Logger.debug('User by email ', JSON.stringify(user));
      if (!user) {
        throw new HttpException('User not found ', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      Logger.error('Error at userservice, findByEmail ', error);
      throw new HttpException(
        'You are not allowed to login, contact administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async userLogin(email: string) {
    Logger.log('UserService finding user by email: %s', email);
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        select: ['createdAt', 'id', 'name', 'email', 'password'],
      });
      Logger.debug('User by email at userLogin', JSON.stringify(user));
      if (!user) {
        throw new HttpException('User not found ', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      Logger.error('Error at userservice, userLogin: ', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(id: string): Promise<User> | undefined {
    try {
      Logger.debug(`Get user byd id ==> ${id}`);
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        select: ['createdAt', 'id', 'name', 'email'],
      });
      Logger.debug('User by email at gteUserById', JSON.stringify(user));
      if (!user) {
        Logger.error('userService getUserbyId, user not found');
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      Logger.error('userService getUserbyId error', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
