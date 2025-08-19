import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { BookingsService } from "../providers/bookings.service";
import { DTOValidationPipe } from "../../common/pipes/dtovalidation.pipe";
import { CreateBookingDTO } from "../dtos/booking.dto";
import { UserEntity } from "../../users/user.entity";
import { AuthGuard } from '../../auth/auth.guard';
import { User } from "../../auth/user.decorator";

// const test_user = new UserEntity();
// test_user.id = '27229aac-e0b3-4e08-8b9f-c7bcf846ed6c';

@Controller("/bookings")
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(
    public service: BookingsService,
  ) { }

  @Get()
  getMany(
    @User() user: UserEntity
  ) {
    return this.service.getBookings(user);
  }

  @Get(':id')
  getOne(
    @Param('id') id: string,
    @User() user: UserEntity
  ) {
    return this.service.getOneBooking(user, id);
  }

  @Post()
  createOne(
    @Body(new DTOValidationPipe(CreateBookingDTO)) body: CreateBookingDTO,
    @User() user: UserEntity,
  ) {
    return this.service.createOne(user, body);
  }
}