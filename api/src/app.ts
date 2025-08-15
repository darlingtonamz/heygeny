import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {type NestExpressApplication} from '@nestjs/platform-express';
import {
  type INestApplication,
  type INestMicroservice,
  ValidationPipe,
} from '@nestjs/common';

const appMode = process.env.APP_MODE

export async function createApp(): Promise<INestApplication | INestMicroservice> {
  let app: NestExpressApplication | INestMicroservice;

  if (!appMode) {
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: true,
    });

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));

    const port = process.env.PORT || 3000;
    await app.listen(port);
  } else if (appMode == "GRPC"){
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'hello',
        protoPath: join(__dirname, 'grpc/proto/hello.proto'),
        url: `${process.env.GRPC_BIND || '0.0.0.0'}:${process.env.GRPC_PORT || 50051}`,
      },
    });
  }
  return app;
}