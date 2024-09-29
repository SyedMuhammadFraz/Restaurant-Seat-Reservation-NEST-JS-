import {IsNotEmpty, IsDate,} from 'class-validator'
import { ObjectId } from "mongodb";
import { Reservation } from '../entities/reservation.entity';


export class CreateReservationDto {
    // @IsNotEmpty()
    // _id:string

    @IsNotEmpty()
    @IsDate()
    public readonly reservedAt: Date;

    @IsNotEmpty()
    @IsDate()
    public readonly reservationStart: Date;

    @IsNotEmpty()
    @IsDate()
    public readonly reservationEnd: Date;

    @IsNotEmpty()
    public readonly userId: ObjectId;

    @IsNotEmpty()
    public readonly tableId: ObjectId;
}

// export function toReservationDTO(reservation:Reservation): CreateReservationDto{
//     return {
//         _id: reservation._id.toHexString(),
//         reservedAt: reservation.reservedAt,
//         reservationStart: reservation.reservationStart,
//         reservationEnd:reservation.reservationEnd,
//         user: toUserDTO(reservation.user),
//         table: toTableDTO(reservation.table),
//     }
// }


