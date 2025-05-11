import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { TaskModule } from './tasks/tasks.module';
import { AiStoreModule } from './ai-store/ai-store.module';
import { MoodsModule } from './moods/moods.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [  MongooseModule.forRoot('mongodb://0.0.0.0:27017/user-management'),
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    TaskModule,
    AiStoreModule,
    MoodsModule,
    PaymentsModule,
  
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
