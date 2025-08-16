import { Body, Controller, Get, Post } from "@nestjs/common";
import { BookingsService } from "../providers/bookings.service";
import { DTOValidationPipe } from "src/common/pipes/dtovalidation.pipe";
import { CreateBookingDTO } from "../dtos/space.dto";

@Controller("/bookings")
export class BookingsController {
  constructor(
    public service: BookingsService,
  ) { }

  @Get()
  getMany() {
    return this.service.getBookings();
  }

  @Get(':id')
  getOne() {
    return this.service.getOneBooking();
  }

  @Post()
  createOne(
    @Body(new DTOValidationPipe(CreateBookingDTO)) body: CreateBookingDTO,
  ) {
    return this.service.createOne();
  }
}