import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { ProfileController } from "./profile.controller";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersService,
    JwtService,
  ],
  controllers: [ProfileController],
  exports: [UsersService],
})
export class UsersModule {}