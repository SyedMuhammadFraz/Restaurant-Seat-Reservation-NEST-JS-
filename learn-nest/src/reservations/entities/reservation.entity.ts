import { User } from 'src/users/entities/user.entity';
import { Table } from 'src/table/entities/table.entity';
import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Reservation {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  reservedAt: Date;

  @Column()
  reservationStart: Date;

  @Column()
  reservationEnd: Date;

  @Column()
  userId: ObjectId;

  @Column()
  tableId: ObjectId;

  // @ManyToOne(() => User, (user) => user.reservationId, { eager: true })
  // user: User;

  // @ManyToOne(() => Table, (table) => table.reservationId, { eager: true })
  // table: Table;
}
