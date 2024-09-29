import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  //Using constructor to use userRepositry
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    if(!createUserDto.email || !createUserDto.name){
      throw new BadRequestException('Email and Name are required');
    }


    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Table # ${createUserDto.email} already exists!`,
      );
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async getUsers() {
    console.log(this.userRepository);
    return this.userRepository.find();
  }

  async getUserbyEmail(email: string) {
    
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException();
    }
    console.log(user)
    return user;
  }


  async getUser(id: string) {
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const user = await this.userRepository.findOne({
      where: { _id: objectId },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const updated_user = await this.userRepository.findOne({
      where: { _id: objectId },
    });

    if (!updated_user) {
      throw new NotFoundException(`User #${id} not found!`);
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: updateUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Table # ${updateUserDto.email} already exists!`,
      );
    }

    Object.assign(updated_user, updateUserDto);

    return this.userRepository.save(updated_user);
  }

  async removeUser(id: string) {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch (err) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const removedUser = await this.userRepository.findOne({
      where: { _id: objectId },
    });
    if (!removedUser) {
      throw new NotFoundException(`Table #${id} not found`);
    }
    await this.userRepository.delete({ _id: objectId });

    return removedUser;
  }
}
