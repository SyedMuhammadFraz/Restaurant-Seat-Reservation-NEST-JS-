import { Entity, Column, ObjectIdColumn, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { ObjectId } from 'mongodb';

@Entity()
export class Table {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  number: number;

  @Column()
  seats: number;

  @Column()
  reservationId: ObjectId[];

  // @OneToMany(() => Reservation, reservation => reservation.table)
  // reservations: Reservation[];
}