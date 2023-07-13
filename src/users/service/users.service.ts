import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDTO, UpdateUserDTO, UserToProjectDTO } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ErrorException } from '../../utils/error.exepction';
import { HttpStatus } from '@nestjs/common/enums';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UsersProjectsEntity)
    private readonly userProjectRepository: Repository<UsersProjectsEntity>,
  ) {}

  public async createUser(body: UserDTO): Promise<UserEntity> {
    try {
      const newUser = { ...body };
      newUser.password = await bcrypt.hash(newUser.password, 10);

      const requiredFields = [
        'username',
        'email',
        'password',
        'firstName',
        'lastName',
        'age',
      ];
      const missingFields = requiredFields.filter((field) => !newUser[field]);

      if (missingFields.length > 0) {
        const errorMessage = `The following required data is missing.: ${missingFields.join(
          ', ',
        )}`;
        throw new ErrorException(errorMessage, HttpStatus.BAD_REQUEST);
      }

      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new ErrorException(
        'Create User error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findUsers(): Promise<UserEntity[]> {
    try {
      const users: UserEntity[] = await this.userRepository.find();
      if (users.length === 0) {
        throw new ErrorException('User list is empty', HttpStatus.NOT_FOUND);
      }
      return users;
    } catch (error) {
      throw new ErrorException(
        'Find Users error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findUserById(id: string): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .leftJoinAndSelect('user.userIncludes', 'userIncludes')
        .leftJoinAndSelect('userIncludes.project', 'project')
        .getOne();
      if (!user) {
        throw new ErrorException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new ErrorException(
        'Find User error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateUser(
    body: UpdateUserDTO,
    id: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const user = await this.userRepository.update(id, body);
      if (user.affected === 0) {
        throw new ErrorException(
          `User can't be updated'`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
    } catch (error) {
      throw new ErrorException(
        'Update User error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult | undefined> {
    try {
      const user = await this.userRepository.delete(id);
      if (user.affected === 0) {
        throw new ErrorException(
          `User can't be deleted'`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
    } catch (error) {
      throw new ErrorException(
        'Delete User error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findBy({ key, value }: { key: keyof UserDTO; value: any }) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne();
      if (!user) {
        throw new ErrorException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new ErrorException(
        'Find User error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async relationToProject(body: UserToProjectDTO) {
    try {
      return await this.userProjectRepository.save(body);
    } catch {
      throw new ErrorException(
        'Relation to project error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
