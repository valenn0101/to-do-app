import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { UserDTO } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async createUser(body: UserDTO): Promise<UserEntity> {
    try {
      const newUser = { ...body };
      newUser.password = await bcrypt.hash(newUser.password, 10);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }
}
