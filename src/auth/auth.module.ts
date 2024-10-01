import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { UserService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      session: true,
      defaultStrategy: 'jwt',
      property: 'user',
    }),
    JwtModule.register({
      secret: 'l3tm3in',
      // signOptions: {
      //   expiresIn: '60s',
      // },
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, JwtStrategy, AuthService],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
