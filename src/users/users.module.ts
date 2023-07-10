import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { UsersProjectsEntity } from './entities/usersProjects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UsersProjectsEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
