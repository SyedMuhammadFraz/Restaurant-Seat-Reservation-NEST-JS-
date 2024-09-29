import { IsNotEmpty, IsDate } from 'class-validator';
import { ObjectId } from 'mongodb';
import { UserDto } from '../../users/dto/userdto.dto';
import { TableDto } from '../../table/dto/tabledto.dto';

export class ReservationDto {
  @IsNotEmpty()
  _id: ObjectId;

  @IsNotEmpty()
  @IsDate()
  reservedAt: Date;

  @IsNotEmpty()
  @IsDate()
  reservationStart: Date;

  @IsNotEmpty()
  @IsDate()
  reservationEnd: Date;

  @IsNotEmpty()
  user: UserDto;

  @IsNotEmpty()
  table: TableDto;
}
