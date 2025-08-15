import { Module } from '@nestjs/common';
import { GrpcController } from './controllers/grpc.controller';

@Module({
  controllers: [GrpcController],
})
export class GrpcModule {}