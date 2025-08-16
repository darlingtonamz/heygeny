import { type BookingEntity } from "../bookings/booking.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'text'})
  public email: string;

  @Column({type: 'text'})
  public password: string;

  @Column({type: 'text'})
  public firstName: Date;

  @Column({type: 'text'})
  public lastName: Date;

  @Column({type: 'text', nullable: true})
  public phone: string;

  @Column({type: 'boolean', nullable: true})
  public isActive: boolean;

  @Column({type: 'timestamp with time zone'})
  public createdAt: Date;

  @Column({type: 'timestamp with time zone'})
  public updatedAt: Date;

  @OneToMany('BookingEntity', (booking: BookingEntity) => booking.user)
  public bookings: BookingEntity[];
}