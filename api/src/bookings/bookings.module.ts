import { Module } from "@nestjs/common";
import { BookingEntity } from "./booking.entity";
import { BookingsService } from "./providers/bookings.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingsController } from "./controllers/bookings.controller";

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}