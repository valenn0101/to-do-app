import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { TasksService } from '../service/tasks.service';
import { TasksDTO } from '../dto/task.dto';
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create/:projectId')
  public async createTask(
    @Body() body: TasksDTO,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.createTask(body, projectId);
  }

  @Put('update/:taskId')
  public async updateTask(
    @Body() body: TasksDTO,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.updateTask(body, taskId);
  }

  @Delete(':taskId')
  public async deleteTask(@Param('taskId') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }
}
