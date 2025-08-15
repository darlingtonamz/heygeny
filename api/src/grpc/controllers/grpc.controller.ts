import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

type Hero = {
  id: number;
  name: string;
} 

type HeroById = {
  id: number
}

@Controller()
export class GrpcController {
  @GrpcMethod('HelloService', 'SayHello')
  sayHello({ name }: { name: string }) {
    return { message: `Hello, ${name}! (from gRPC)` };
  }
}

@Controller()
export class HeroesController {
  @GrpcMethod('HeroesService', 'FindOne')
  findOne(data: HeroById, metadata: Metadata, call: ServerUnaryCall<any, any>): Hero {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];
    return items.find(({ id }) => id === data.id);
  }
}