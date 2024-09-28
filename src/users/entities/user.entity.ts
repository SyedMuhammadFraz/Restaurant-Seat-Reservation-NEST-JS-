import { Entity, Column, ObjectIdColumn, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { ObjectId } from 'mongodb';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  reservationId: ObjectId[];

  // @OneToMany(() => Reservation, (reservation) => reservation.user)
  // reservations: Reservation[];
}
