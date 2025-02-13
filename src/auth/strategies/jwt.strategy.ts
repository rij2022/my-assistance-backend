import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '55dc9d194ef26afcac0230b5880c573b91d029d39a75cd3a313bdb30c9faa368dbda01f3e795eb30397560c977559510afa7da25aba31586f2d59500b1ff9c8b', // Replace with a strong secret key
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}