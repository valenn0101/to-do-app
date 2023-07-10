import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsEntity } from '../../projects/entity/projects.entity';
import { ProjectsService } from '../../projects/service/projects.service';
import { ErrorException } from '../../utils/error.exepction';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

describe('ProjectsService', () => {
  let projectsService: ProjectsService;
  let projectsRepository: Repository<ProjectsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(ProjectsEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    projectsService = module.get<ProjectsService>(ProjectsService);
    projectsRepository = module.get<Repository<ProjectsEntity>>(
      getRepositoryToken(ProjectsEntity),
    );
  });

  it('should create a new projet', async () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const id = uuidv4();

    const mockProjectDTO = {
      id: id,
      createdAt: createdAt,
      updatedAt: updatedAt,
      name: 'test',
      description: 'test',
    };

    const savedProject = {
      ...mockProjectDTO,
      id: id,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    jest.spyOn(projectsRepository, 'save').mockResolvedValue(savedProject);
    const createdProject = await projectsService.createProject(mockProjectDTO);
    expect(createdProject).toEqual(savedProject);
  });

  it('should throw an exception when required fields are missing', async () => {
    const mockProjectDTO = {
      name: 'test',
      description: undefined,
    };

    await expect(
      projectsService.createProject(mockProjectDTO),
    ).rejects.toThrow();
  });

  it('should be return an array of projects', async () => {
    const projects: ProjectsEntity[] = [
      {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'test1',
        description: 'test1',
      },
      {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'test2',
        description: 'test2',
      },
    ];
    jest.spyOn(projectsRepository, 'find').mockResolvedValue(projects);

    const projectsReturned = await projectsService.findProjects();
    expect(projectsReturned).toEqual(projects);
  });

  it('should throw an error if an error occurs during finding projects', async () => {
    jest.spyOn(projectsRepository, 'find').mockRejectedValue(new Error());

    await expect(projectsService.findProjects()).rejects.toThrow(
      new ErrorException(
        'Error find projects',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });

  it('should return the project with the specified ID', async () => {
    const projectId = 'project-id';
    const mockProject: ProjectsEntity = {
      createdAt: new Date(),
      updatedAt: new Date(),
      id: projectId,
      name: 'Test Project',
      description: 'Test Description',
    };
    jest.spyOn(projectsRepository, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockProject),
    } as any);

    const foundProject = await projectsService.findProjectById(projectId);

    expect(projectsRepository.createQueryBuilder).toHaveBeenCalledWith(
      'project',
    );

    expect(projectsRepository.createQueryBuilder().where).toHaveBeenCalledWith({
      id: projectId,
    });

    expect(foundProject).toEqual(mockProject);
  });

  it('should throw an exception when project is not found', async () => {
    jest.spyOn(projectsRepository, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnValue(undefined),
    } as any);

    await expect(
      projectsService.findProjectById('b596bd3f-87a3-4dfe-942f-bf2d2c320021'),
    ).rejects.toThrow();
    new ErrorException('Error find project', HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should update a user', async () => {
    const mockUpdateProject = {
      name: 'updated',
      description: 'updated',
    };
    const mockProjectId = '1234';

    const mockUpdateResult: UpdateResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };
    jest
      .spyOn(projectsRepository, 'update')
      .mockResolvedValue(mockUpdateResult);

    const mockProject: ProjectsEntity = {
      id: mockProjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'test',
      description: 'test',
    };
    jest.spyOn(projectsRepository, 'findOne').mockResolvedValue(mockProject);

    const updatedProject = await projectsService.updateProject(
      mockUpdateProject,
      mockProjectId,
    );

    expect(projectsRepository.update).toHaveBeenCalledWith(
      mockProjectId,
      mockUpdateProject,
    );

    expect(updatedProject).toEqual(mockUpdateResult);
  });

  it('should throw an exception when user is not found', async () => {
    const mockUpdateProject = {
      name: 'updated',
      description: 'updated',
    };
    const mockUserId = '1234';

    const mockUpdateResult: UpdateResult = {
      affected: 0,
      raw: [],
      generatedMaps: [],
    };
    jest
      .spyOn(projectsRepository, 'update')
      .mockResolvedValue(mockUpdateResult);
    jest.spyOn(projectsRepository, 'findOne').mockResolvedValue(null);

    await expect(
      projectsService.updateProject(mockUpdateProject, mockUserId),
    ).rejects.toThrow(
      new ErrorException(
        'Update Project error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });

  it('should delete a user', async () => {
    const projectId = 'project-id';
    const deleteResult: DeleteResult = { affected: 1 } as DeleteResult;
    jest.spyOn(projectsRepository, 'delete').mockResolvedValue(deleteResult);

    const result = await projectsService.deleteProject(projectId);

    expect(projectsRepository.delete).toHaveBeenCalledWith(projectId);

    expect(result).toEqual(deleteResult);
  });

  it('should throw an exception when user not found', async () => {
    const projectId = 'non-existing-project-id';
    const deleteResult: DeleteResult = { affected: 0 } as DeleteResult;
    jest.spyOn(projectsRepository, 'delete').mockResolvedValue(deleteResult);

    await expect(projectsService.deleteProject(projectId)).rejects.toThrow(
      new ErrorException('Delete Project error', HttpStatus.BAD_REQUEST),
    );
  });
});
