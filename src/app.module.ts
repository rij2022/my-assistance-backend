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


@Module({
  imports: [  MongooseModule.forRoot('mongodb://localhost/user-management'),
    UserModule,
    AuthModule,
    TaskModule,
    AiStoreModule,
    MoodsModule,
  
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
