import { ConflictException, Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Paginate, type PaginateQuery,FilterOperator, paginate } from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
  ){}

  async create(createUserDto:CreateUserDto){
    const existingUser=await this.userRepository.findOne({
      where:{email:createUserDto.email},
    })
    if(existingUser){
      throw new ConflictException('a user with tis email is already exists')
    }
    const user=this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

   async findAll(Query:PaginateQuery) {
    return paginate(Query,this.userRepository,{
      sortableColumns:[
        "id",
        "firstName",
        "lastName",
        "email",
        "createdAt",
      ],
      searchableColumns:[
        "firstName",
        "lastName",
        "email",
      ],
      filterableColumns:{
        firstName:[FilterOperator.EQ],
        lastName:[FilterOperator.EQ],
        email :[FilterOperator.EQ],
      },

      defaultSortBy:[['id','ASC']],
      defaultLimit:10,
      maxLimit:100,

    });
  }

  async findOne(id: number) {
    const user= await this.userRepository.findOne({
      where:{id}
    }) ;
    if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user=await this.userRepository.preload({
      id,
      ...updateUserDto,
    })
    if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user=await this.findOne(id);
    await this.userRepository.remove(user);

    if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
