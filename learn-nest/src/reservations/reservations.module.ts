import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Table } from 'src/table/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Table])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
