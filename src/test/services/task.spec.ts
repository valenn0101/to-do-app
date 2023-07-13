import { HttpStatus } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectsService } from '../../projects/service/projects.service';
import { ErrorException } from '../../utils/error.exepction';
import { TasksDTO, UpdateTasksDTO } from '../../tasks/dto/task.dto';
import { TasksEntity } from '../../tasks/entities/task.entity';
import { TasksService } from '../../tasks/service/tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: Repository<TasksEntity>;
  let projectService: ProjectsService;

  beforeEach(() => {
    taskRepository = {} as Repository<TasksEntity>;
    projectService = {} as ProjectsService;
    tasksService = new TasksService(taskRepository, projectService);
  });

  describe('createTask', () => {
    it('should create a task when provided a valid project', async () => {
      const projectId = 'project-id-1';
      const project = {
        id: projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Test Project',
        description: 'Test Description',
        projectInclude: undefined,
      };
      const body = {
        taskName: 'Task 1',
        taskDescription: 'Description 1',
        status: undefined,
        project: project,
        responsableName: undefined,
      };
      const expectedTask = { ...body, project };

      projectService.findProjectById = jest.fn().mockResolvedValue(project);

      taskRepository.save = jest.fn().mockResolvedValue(expectedTask);

      const createdTask = await tasksService.createTask(body, projectId);

      expect(projectService.findProjectById).toHaveBeenCalledWith(projectId);
      expect(taskRepository.save).toHaveBeenCalledWith(expectedTask);
      expect(createdTask).toEqual(expectedTask);
    });

    it('should throw an ErrorException when the project does not exist', async () => {
      const body: TasksDTO = {
        taskName: 'Task 1',
        taskDescription: 'Description 1',
        status: undefined,
        project: undefined,
        responsableName: undefined,
      };
      const projectId = 'non-existing-project-id';
      const error = new ErrorException(
        'Project not found',
        HttpStatus.NOT_FOUND,
      );

      projectService.findProjectById = jest.fn().mockResolvedValue(undefined);

      await expect(
        tasksService.createTask(body, projectId),
      ).rejects.toThrowError(error);
      expect(projectService.findProjectById).toHaveBeenCalledWith(projectId);
    });
  });

  describe('updateTask', () => {
    it('should update a task when provided a valid project and task data', async () => {
      const body: UpdateTasksDTO = {
        taskName: 'Updated Task',
        taskDescription: 'Updated Description',
      };
      const projectId = 'project-id-1';
      const expectedUpdateResult: UpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      taskRepository.update = jest.fn().mockResolvedValue(expectedUpdateResult);

      const updatedTask = await tasksService.updateTask(body, projectId);

      expect(taskRepository.update).toHaveBeenCalledWith(projectId, body);
      expect(updatedTask).toEqual(expectedUpdateResult);
    });

    it('should throw an ErrorException when the task does not exist', async () => {
      const body: UpdateTasksDTO = {
        taskName: 'Updated Task',
        taskDescription: 'Updated Description',
      };
      const projectId = 'non-existing-project-id';
      const error = new ErrorException('Task not found', HttpStatus.NOT_FOUND);

      taskRepository.update = jest.fn().mockResolvedValue({ affected: 0 });

      await expect(
        tasksService.updateTask(body, projectId),
      ).rejects.toThrowError(error);
      expect(taskRepository.update).toHaveBeenCalledWith(projectId, body);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const projectId = 'project-id-1';
      const expectedDeleteResult: UpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      taskRepository.delete = jest.fn().mockResolvedValue(expectedDeleteResult);

      const deletedTask = await tasksService.deleteTask(projectId);

      expect(taskRepository.delete).toHaveBeenCalledWith(projectId);
      expect(deletedTask).toEqual(expectedDeleteResult);
    });

    it('should thorw an exception when user not found', async () => {
      const projectId = 'non-existing-project-id';
      const deleteResult: DeleteResult = { affected: 0 } as DeleteResult;
      jest.spyOn(taskRepository, 'delete').mockResolvedValue(deleteResult);

      await expect(tasksService.deleteTask(projectId)).rejects.toThrow(
        new ErrorException('Delete Task error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
