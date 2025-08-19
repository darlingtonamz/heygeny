import { IsDateString, IsDefined, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

export class CreateBookingDTO {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public serviceType: string;

  @IsNotEmpty()
  @IsDateString()
  @IsDefined()
  public bookingDate: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsEnum(BookingStatus)
  public status: string;

  @IsOptional()
  @IsString()
  public notes: string;

  @IsOptional()
  @IsNumber()
  public totalAmount: number;
}