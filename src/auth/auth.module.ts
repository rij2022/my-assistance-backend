import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [  MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: '55dc9d194ef26afcac0230b5880c573b91d029d39a75cd3a313bdb30c9faa368dbda01f3e795eb30397560c977559510afa7da25aba31586f2d59500b1ff9c8b', // Replace with a strong secret key
      signOptions: { expiresIn: '2h' }, // Token expires in 1 hour
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}