import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserDTO } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  public async registerUser(@Body() body: UserDTO) {
    return await this.usersService.createUser(body);
  }
}
