import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: '55dc9d194ef26afcac0230b5880c573b91d029d39a75cd3a313bdb30c9faa368dbda01f3e795eb30397560c977559510afa7da25aba31586f2d59500b1ff9c8b',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
