import { IsNotEmpty } from "class-validator";
import { Table } from "../entities/table.entity";
import { ObjectId } from "mongodb";

export class CreateTableDto {
    // readonly _id: string;

    @IsNotEmpty()
    number:number;

    @IsNotEmpty()
    seats: number;
}


// export function toTableDTO(table: Table): CreateTableDto{
//     return{
//         _id: table._id.toHexString(),
//         number: table.number,
//         seats: table.seats,
//     }
// }