import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BookingsService } from "../providers/bookings.service";
import { DTOValidationPipe } from "../../common/pipes/dtovalidation.pipe";
import { CreateBookingDTO } from "../dtos/space.dto";
import { UserEntity } from "../../users/user.entity";

const test_user = new UserEntity();
test_user.id = '27229aac-e0b3-4e08-8b9f-c7bcf846ed6c';

@Controller("/bookings")
export class BookingsController {
  constructor(
    public service: BookingsService,
  ) { }

  @Get()
  getMany() {
    return this.service.getBookings(test_user);
  }

  @Get(':id')
  getOne(
    @Param('id') id: string,
  ) {
    return this.service.getOneBooking(id);
  }

  @Post()
  createOne(
    @Body(new DTOValidationPipe(CreateBookingDTO)) body: CreateBookingDTO,
  ) {
    return this.service.createOne(test_user, body);
  }
}