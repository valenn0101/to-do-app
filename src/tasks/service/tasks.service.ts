import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksEntity } from '../entities/task.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectsService } from '../../projects/service/projects.service';
import { ErrorException } from '../../utils/error.exepction';
import { TasksDTO, UpdateTasksDTO } from '../dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksEntity)
    private readonly taskRepository: Repository<TasksEntity>,
    private readonly projectService: ProjectsService,
  ) {}

  public async createTask(
    body: TasksDTO,
    projectId: string,
  ): Promise<TasksEntity> {
    try {
      const project = await this.projectService.findProjectById(projectId);
      if (project === undefined) {
        throw new ErrorException('Project not found', HttpStatus.NOT_FOUND);
      }
      return await this.taskRepository.save({
        ...body,
        project,
      });
    } catch (error) {
      throw new ErrorException(error.message, error.status);
    }
  }

  public async updateTask(
    body: UpdateTasksDTO,
    projectId: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const project = await this.taskRepository.update(projectId, body);
      if (project.affected === 0) {
        throw new ErrorException('Task not found', HttpStatus.NOT_FOUND);
      }
      return project;
    } catch (error) {
      throw new ErrorException(error.message, error.status);
    }
  }

  public async deleteTask(id: string): Promise<DeleteResult | undefined> {
    try {
      const task = await this.taskRepository.delete(id);
      if (task.affected === 0) {
        throw new ErrorException('Task not found', HttpStatus.NOT_FOUND);
      }
      return task;
    } catch (error) {
      throw new ErrorException(error.message, error.status);
    }
  }
}
