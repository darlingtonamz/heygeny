import { UserEntity } from "../users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'uuid'})
  public userId: string;

  @Column({type: 'text'})
  public serviceType: string;

  @Column({type: 'timestamp with time zone'})
  public bookingDate: Date;

  @Column({type: 'text', nullable: true})
  public status: string;

  @Column({type: 'text', nullable: true})
  public notes: string;

  @Column({type: 'decimal', nullable: true})
  public totalAmount: number;

  @Column({type: 'timestamp with time zone'})
  public createdAt: Date;

  @Column({type: 'timestamp with time zone'})
  public updatedAt: Date;

  @ManyToOne(
    () => UserEntity,
    (user) => user.bookings,
    {onDelete: 'CASCADE'},
  )
  public user: UserEntity;
}