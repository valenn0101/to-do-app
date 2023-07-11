import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  isObject,
} from 'class-validator';
import { STATUS_TASK } from '../../constants/status-task';
import { ProjectDTO } from '../../projects/dto/projects.dto';
import { UserEntity } from 'src/users/entities/users.entity';

export class TasksDTO {
  @IsNotEmpty()
  @IsString()
  taskName: string;

  @IsNotEmpty()
  @IsString()
  taskDescription: string;

  @IsNotEmpty()
  @IsEnum(STATUS_TASK)
  status: STATUS_TASK;

  @IsNotEmpty()
  @IsString()
  responsableName: string;

  @IsOptional()
  project?: ProjectDTO;
}

export class UpdateTasksDTO {
  @IsOptional()
  @IsString()
  taskName?: string;

  @IsOptional()
  @IsString()
  taskDescription?: string;

  @IsOptional()
  @IsEnum(STATUS_TASK)
  status?: STATUS_TASK;

  @IsOptional()
  @IsString()
  responsableName?: string;
}
