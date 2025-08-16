import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { BookingEntity } from "../booking.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingsService {
  private repo: Repository<BookingEntity>;
  constructor(
    @InjectRepository(BookingEntity) repo: Repository<BookingEntity>,
  ) {
    this.repo = repo;
  }

  public async getBookings() {
    return this.repo.find({ where: { id: Not(null) } });
  }

  public async getOneBooking() {
    return Promise.resolve({});
  }

  public async createOne() {
    return Promise.resolve({});
  }
}