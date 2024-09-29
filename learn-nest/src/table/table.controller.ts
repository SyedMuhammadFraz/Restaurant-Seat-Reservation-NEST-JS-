import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableService } from './table.service';
import { Table } from './entities/table.entity';
import { ObjectId } from 'mongodb';

@Controller('table')
export class TableController {

constructor(private readonly tableService:TableService){}

  @Get()
  async getTables() {
    return this.tableService.getTables();
  }

  @Get(':id')
  async getOneTableonID(@Param('id') id: string):Promise<Table> {
    return this.tableService.getTable(id);
  }

  @Post()
  createTable(@Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto);                                                          
  }

  @Patch(':id')
  updateTable(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.updateTable(id, updateTableDto);
  }

  @Delete(':id')
  deleteTable(@Param('id') id: string,) {
    return this.tableService.removeTable(id);
  }
}
