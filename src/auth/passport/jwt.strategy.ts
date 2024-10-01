import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/users.entity';

export interface JwtPayload {
  email?: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'l3tm3in',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return await this.authService.validateUser(payload);
  }
}
