import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TableModule } from './table/table.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './table/entities/table.entity';
import { User } from './users/entities/user.entity';
import { Reservation } from './reservations/entities/reservation.entity';

@Module({
  imports: [
    TableModule,
    UsersModule,
    ReservationsModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      database: "Restaurant_Seat_Reservation",
      entities: [Table, User, Reservation],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Table, User, Reservation]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
