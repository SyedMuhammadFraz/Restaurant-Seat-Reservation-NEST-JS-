import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';
import { ObjectId } from 'mongodb';
import { BadRequestException, ConflictException } from '@nestjs/common';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}
  // private tables = [
  //   { id: 0, number: 56, user: 'Ali', reserved: true },
  //   { id: 1, number: 59, user: 'Aslam', reserved: true },
  //   { id: 2, number: 543, user: 'NA', reserved: false },
  // ];

  async getTables() {
    console.log(this.tableRepository);

    return this.tableRepository.find();
  }

  async getTable(id: string) {
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const table = await this.tableRepository.findOne({
      where: { _id: objectId },
    });

    if (!table) {
      throw new NotFoundException(`Table #${id} not found`);
    }
    console.log(table);
    return table;
  }

  async createTable(createTableDto: CreateTableDto) {

    if(!createTableDto.seats || !createTableDto.number){
      throw new BadRequestException('Table # or seats cannot be empty!');
    }

    const existingTable = await this.tableRepository.findOne({
      where: { number: createTableDto.number },
    });

    if (existingTable) {
      throw new ConflictException(
        `Table # ${createTableDto.number} already exists!`,
      );
    }
    const table = this.tableRepository.create(createTableDto);
    console.log(table);
    return this.tableRepository.save(table);
  }

  async updateTable(id: string, updateTableDto: UpdateTableDto) {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch (err) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const updated_table = await this.tableRepository.findOne({
      where: { _id: objectId },
    });

    if (!updated_table) {
      throw new NotFoundException(`Table #${id} not found`);
    }

    

    const existingTable = await this.tableRepository.findOne({
      where: { number: updateTableDto.number },
    });

    if (existingTable) {
      throw new ConflictException(
        `Table # ${updateTableDto.number} already exists!`,
      );
    }

    Object.assign(updated_table, updateTableDto);

    return this.tableRepository.save(updated_table);
  }

  async removeTable(id: string): Promise<Table> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch (err) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const removedTable = await this.tableRepository.findOne({
      where: { _id: objectId },
    });
    if (!removedTable) {
      throw new NotFoundException(`Table #${id} not found`);
    }
    await this.tableRepository.delete({ _id: objectId });

    return removedTable;
  }
}
