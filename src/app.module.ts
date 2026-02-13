import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPort = Number(configService.getOrThrow<string>(ENV_DB_PORT_KEY));

        if (Number.isNaN(dbPort)) {
          throw new Error(`${ENV_DB_PORT_KEY} must be a number`);
        }

        return {
          type: 'postgres', // 데이터베이스 타입 (PostgreSQL 사용)
          host: configService.getOrThrow<string>(ENV_DB_HOST_KEY), // 데이터베이스 서버 호스트
          port: dbPort, // 데이터베이스 연결 포트
          username: configService.getOrThrow<string>(ENV_DB_USERNAME_KEY), // 데이터베이스 접속 사용자명
          password: configService.getOrThrow<string>(ENV_DB_PASSWORD_KEY), // 데이터베이스 접속 비밀번호
          database: configService.getOrThrow<string>(ENV_DB_DATABASE_KEY), // 사용할 데이터베이스 이름
          entities: [PostsModel, UsersModel], // Entity 클래스 배열 (자동 매핑할 테이블)
          synchronize: true, // Entity와 DB 스키마 자동 동기화 (개발용, 프로덕션에서는 false)
        };
      },
    }),
    UsersModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
