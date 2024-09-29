import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Table } from 'src/table/entities/table.entity';
import { ObjectId } from 'mongodb';
import { plainToClass } from 'class-transformer';
import { ReservationDto } from './dto/reservationdto.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  async createReservation(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const userId = new ObjectId(createReservationDto.userId);
    const tableId = new ObjectId(createReservationDto.tableId);

    const user = await this.userRepository.findOne({ where: { _id: userId } });
    const table = await this.tableRepository.findOne({
      where: { _id: tableId },
    });

    const reservation = new Reservation();
    reservation.reservedAt = createReservationDto.reservedAt;
    reservation.reservationStart = createReservationDto.reservationStart;
    reservation.reservationEnd = createReservationDto.reservationEnd;
    reservation.userId = userId;
    reservation.tableId = tableId;

    await this.reservationRepository.save(reservation);

    user.reservationId = [...(user.reservationId || []), reservation._id];
    await this.userRepository.save(user);
    console.log(user.reservationId);

    table.reservationId = [...(table.reservationId || []), reservation._id];
    await this.tableRepository.save(table);
    console.log(table.reservationId);

    const createdReservation = await this.reservationRepository.findOne({
      where: { _id: reservation._id },
    });

    console.log(reservation);

    return reservation;
  }

  async findOnebyUser(id: string) {
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const user = await this.reservationRepository.find({
      where: { userId: objectId },
    });

    if (!user) {
      throw new NotFoundException();
    }
    console.log(typeof (user));
    console.log(user);

    return user;
  }

  async findOne(id: string) {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch (err) {
      throw new BadRequestException(`Invalid Id Format: ${id}`);
    }

    const reservation = await this.reservationRepository.findOne({
      where: { _id: objectId },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation #${id} not found`);
    }

    console.log(reservation);
    await this.reservationRepository.save(reservation);

    return reservation;
  }

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find();
    console.log(JSON.stringify(reservations, null, 2));
    return reservations;
  }

  async updateReservation(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ) {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch (err) {
      throw new BadRequestException(`Invalid Id Format: ${id}`);
    }

    const userId = new ObjectId(updateReservationDto.userId);
    const tableId = new ObjectId(updateReservationDto.tableId);

    const updatedReservation = await this.reservationRepository.findOne({
      where: { _id: objectId },
    });

    if (!updatedReservation) {
      throw new NotFoundException(`Reservation #${id} not found`);
    }

    if (updateReservationDto.tableId) {
      const new_table = await this.tableRepository.findOne({
        where: { _id: tableId },
      });

      if (!new_table) {
        throw new NotFoundException(`Table #${tableId} not found`);
      }

      if (updatedReservation.tableId) {
        const prev_table = await this.tableRepository.findOne({
          where: { _id: updatedReservation.tableId },
        });

        if (prev_table) {
          prev_table.reservationId = prev_table.reservationId || [];
          prev_table.reservationId = prev_table.reservationId.filter(
            (res) => !res.equals(new ObjectId(updatedReservation._id)),
          );
          await this.tableRepository.save(prev_table);
        }
      }

      new_table.reservationId = [
        ...(new_table.reservationId || []),
        updatedReservation._id,
      ];
      await this.tableRepository.save(new_table);

      updatedReservation.tableId = tableId;
    }

    // Checking fro updation in user ID
    if (updateReservationDto.userId) {
      const new_user = await this.userRepository.findOne({
        where: { _id: userId },
      });

      if (!new_user) {
        throw new NotFoundException(`User #${userId} not found`);
      }

      if (updatedReservation.userId) {
        const prev_user = await this.userRepository.findOne({
          where: { _id: updatedReservation.userId },
        });

        if (prev_user) {
          prev_user.reservationId = prev_user.reservationId || [];
          prev_user.reservationId = prev_user.reservationId.filter(
            (res) => !res.equals(updatedReservation._id),
          );
          await this.userRepository.save(prev_user);
        }
      }

      new_user.reservationId = [
        ...(new_user.reservationId || []),
        updatedReservation._id,
      ];
      await this.userRepository.save(new_user);

      updatedReservation.userId = userId;
    }

    // Checking for update in table ID

    Object.assign(updatedReservation, UpdateReservationDto);

    return this.reservationRepository.save(updatedReservation);
  }

  async deleteReservation(id: string): Promise<Reservation> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch (err) {
      throw new BadRequestException(`Invalid Id Format: ${id}`);
    }

    const removedReservation = await this.reservationRepository.findOne({
      where: { _id: objectId },
    });

    if (!removedReservation) {
      throw new NotFoundException(`Reservation ${id} not found.`);
    }

    if (removedReservation.userId) {
      const user = await this.userRepository.findOne({
        where: { _id: removedReservation.userId },
      });

      if (user) {
        user.reservationId = user.reservationId.filter(
          (res) => !res.equals(removedReservation._id),
        );

        await this.userRepository.save(user);
      }
    }

    if (removedReservation.tableId) {
      const table = await this.tableRepository.findOne({
        where: { _id: removedReservation.tableId },
      });

      if (table) {
        table.reservationId = table.reservationId.filter(
          (res) => !res.equals(removedReservation._id),
        );

        await this.tableRepository.save(table);
      }
    }

    await this.reservationRepository.delete({ _id: objectId });

    return removedReservation;
  }
}
