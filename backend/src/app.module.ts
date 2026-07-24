import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule,ConfigService } from '@nestjs/config';


@Module({
  imports: [
    
    ConfigModule.forRoot({
    isGlobal:true,
    }),

    UsersModule,TypeOrmModule.forRootAsync({
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>({    
    type:'postgres',
    host:configService.get<string>('DB_HOST'),
    port: Number(configService.get<string>('DB_PORT')),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    autoLoadEntities:true,
    synchronize:true})
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
