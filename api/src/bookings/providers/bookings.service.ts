import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { BookingEntity } from "../booking.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "src/users/user.entity";
import { CreateBookingDTO } from "../dtos/booking.dto";

export type GetManyDefaultResponse<T> = {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

@Injectable()
export class BookingsService {
  private repo: Repository<BookingEntity>;
  constructor(
    @InjectRepository(BookingEntity) repo: Repository<BookingEntity>,
  ) {
    this.repo = repo;
  }

  public async getBookings(user: UserEntity, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    let [{count}] = await this.repo.query(`SELECT COUNT(*) 
      FROM "bookings"
      WHERE "userId" = $1
      OFFSET $2
      LIMIT $3`, [user.id, offset, limit]);
    count = Number(count);
    const fetchedBookings = await this.repo.find({
      where: { userId: user.id },
      take: limit,
      skip: offset,
    });
    return {
      data: fetchedBookings,
      count: fetchedBookings.length,
      total: count,
      page,
      pageCount: Math.ceil(count / limit),
    }
  }

  public async getOneBooking(user: UserEntity, id: string) {
    const booking = await this.repo.findOne({ where: { userId: user.id, id } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  public async createOne(user: UserEntity, payload: CreateBookingDTO) {
    const bookingObj = this.repo.merge(new BookingEntity(), {...payload, userId: user.id})
    return this.repo.save(bookingObj);
  }
}