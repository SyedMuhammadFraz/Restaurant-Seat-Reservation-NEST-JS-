import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ReservationDto } from '../../reservations/dto/reservationdto.dto'; // Import ReservationDto if needed

export class UserDto {
  @IsNotEmpty()
  _id: ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  // If you need to include related reservations without causing circular references
  reservations?: ReservationDto[];
}
