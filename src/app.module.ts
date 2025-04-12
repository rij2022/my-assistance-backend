import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { TaskModule } from './tasks/tasks.module';


@Module({
  imports: [  MongooseModule.forRoot('mongodb://localhost/user-management'),
    UserModule,
    AuthModule,
    TaskModule,
  
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
