import { IsNotEmpty, IsNumber } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ReservationDto } from '../../reservations/dto/reservationdto.dto'; 

export class TableDto {
  @IsNotEmpty()
  _id: ObjectId;

  @IsNotEmpty()
  @IsNumber()
  number: number;

  @IsNotEmpty()
  @IsNumber()
  seats: number;

  
  reservations?: ReservationDto[];
}
