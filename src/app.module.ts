import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      entities: [], // Entity 클래스 배열 (자동 매핑할 테이블)
      synchronize: true, // Entity와 DB 스키마 자동 동기화 (개발용, 프로덕션에서는 false)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
