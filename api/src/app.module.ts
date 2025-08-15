import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GrpcModule } from './grpc/grpc.module';

const appMode = process.env.APP_MODE

export const AppModeModulesMap = {
  GRPC: [
    GrpcModule,
  ],
  HTTP: [
    ScheduleModule.forRoot(),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   inject: [ConfigService],
    //   useFactory: async (cfg: ConfigService) => ({
    //     store: await redisStore({
    //       url: cfg.get<string>('REDIS_URL', 'redis://redis:6379'),
    //     }),
    //   }),
    // }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET', 'changeme'),
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN', '1d') },
      }),
    }),
  ]
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        url: cfg.get<string>('DATABASE_URL'),
        // autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ...(AppModeModulesMap[appMode] ?
      AppModeModulesMap[appMode] : AppModeModulesMap.HTTP),
  ],
  controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }