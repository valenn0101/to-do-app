import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/service/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { UserEntity } from '../../users/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ErrorException } from '../../utils/error.exepction';
import { HttpStatus } from '@nestjs/common/enums';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should create a new user', async () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const id = uuidv4();

    const mockUserDTO = {
      id: id,
      createdAt: createdAt,
      updatedAt: updatedAt,
      username: 'testuser',
      email: 'test@example.com',
      password: 'secret',
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
    };

    const hashedPassword = await bcrypt.hash('secret', 10);
    const savedUser = {
      ...mockUserDTO,
      password: hashedPassword,
      id: id,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

    const createdUser = await usersService.createUser(mockUserDTO);

    // Verifica todas las propiedades excepto la contraseña ya que siempre sera diferente
    expect(createdUser).toEqual(
      expect.objectContaining({
        id: savedUser.id,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
        username: savedUser.username,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        age: savedUser.age,
      }),
    );
  });

  it('should throw an exception when required fields are missing', async () => {
    const mockUserDTO = {
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
      password: undefined,
    };

    await expect(usersService.createUser(mockUserDTO)).rejects.toThrow();
  });

  it('should return an array of users', async () => {
    const users: UserEntity[] = [
      {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'testuser',
        email: 'test@example.com',
        password: 'secret',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      },
      {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'testuser2',
        email: 'test@example.com',
        password: 'secret',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      },
    ];

    jest.spyOn(userRepository, 'find').mockResolvedValue(users);

    const usersReturned = await usersService.findUsers();

    expect(usersReturned).toEqual(users);
  });

  it('should throw an error if an error occurs during finding users', async () => {
    jest.spyOn(userRepository, 'find').mockRejectedValue(new Error());

    await expect(usersService.findUsers()).rejects.toThrowError(
      new ErrorException('Find Users error', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });

  it('should return the user with the specified ID', async () => {
    const mockUser = {
      id: 'user-id',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
    };

    jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockUser as UserEntity),
    } as any);

    const foundUser = await usersService.findUserById('user-id');

    expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(userRepository.createQueryBuilder().where).toHaveBeenCalledWith({
      id: 'user-id',
    });

    expect(foundUser).toEqual(mockUser);
  });

  it('should throw an exception when user is not found', async () => {
    jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(undefined),
    } as any);

    await expect(
      usersService.findUserById('b596bd3f-87a3-4dfe-942f-bf2d2c320021'),
    ).rejects.toThrow(
      new ErrorException('Find User error', HttpStatus.NOT_FOUND),
    );
  });

  it('should update a user', async () => {
    const mockUpdateUserDTO = {
      firstName: 'Updated',
      lastName: 'User',
      age: 30,
      email: 'updated@example.com',
      username: 'updateduser',
      password: 'newpassword',
    };
    const mockUserId = '12345';

    const mockUpdateResult: UpdateResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };
    jest.spyOn(userRepository, 'update').mockResolvedValue(mockUpdateResult);

    const mockUser: UserEntity = {
      id: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
    };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const updatedUser = await usersService.updateUser(
      mockUpdateUserDTO,
      mockUserId,
    );

    expect(userRepository.update).toHaveBeenCalledWith(
      mockUserId,
      mockUpdateUserDTO,
    );

    expect(updatedUser).toBe(mockUpdateResult);
  });

  it('should throw an exception when user is not found', async () => {
    const mockUpdateUserDTO = {
      firstName: 'Updated',
      lastName: 'User',
      age: 30,
      email: 'updated@example.com',
      username: 'updateduser',
      password: 'newpassword',
    };
    const mockUserId = '12345';

    const mockUpdateResult: UpdateResult = {
      affected: 0,
      raw: [],
      generatedMaps: [],
    };
    jest.spyOn(userRepository, 'update').mockResolvedValue(mockUpdateResult);

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(
      usersService.updateUser(mockUpdateUserDTO, mockUserId),
    ).rejects.toThrow(
      new ErrorException('Update User error', HttpStatus.BAD_REQUEST),
    );
  });

  it('should delete a user', async () => {
    const userId = 'user-id';
    const deleteResult: DeleteResult = { affected: 1 } as DeleteResult;
    jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult);

    const result = await usersService.deleteUser(userId);

    expect(userRepository.delete).toHaveBeenCalledWith(userId);

    expect(result).toEqual(deleteResult);
  });

  it('should throw an exception when user not found', async () => {
    const userId = 'non-existing-user-id';
    const deleteResult: DeleteResult = { affected: 0 } as DeleteResult;
    jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult);

    await expect(usersService.deleteUser(userId)).rejects.toThrow(
      new ErrorException(`Delete User error`, HttpStatus.BAD_REQUEST),
    );
  });
});
