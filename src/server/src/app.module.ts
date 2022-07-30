import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { TaskModule } from './task/task.module';

var dbConfig = {
  type: process.env.TYPEORM_CONNECTION || 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: process.env.TYPEORM_PORT || '5432',
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || '123123',
  database: process.env.TYPEORM_DATABASE || 'todo'
} as TypeOrmModuleOptions;

@Module({
  imports: [
    AuthModule,
    UserModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      ...dbConfig,
      autoLoadEntities: true,
      synchronize: true
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
