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

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres', // 데이터베이스 타입 (PostgreSQL 사용)
      host: 'localhost', // 데이터베이스 서버 호스트
      port: 5433, // 데이터베이스 연결 포트
      username: 'postgres', // 데이터베이스 접속 사용자명
      password: 'postgres', // 데이터베이스 접속 비밀번호
      database: 'postgres', // 사용할 데이터베이스 이름
      entities: [PostsModel, UsersModel], // Entity 클래스 배열 (자동 매핑할 테이블)
      synchronize: true, // Entity와 DB 스키마 자동 동기화 (개발용, 프로덕션에서는 false)
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
