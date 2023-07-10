import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from '../entity/projects.entity';
import { ProjectDTO, UpdateProjectDTO } from '../dto/projects.dto';
import { ErrorException } from 'src/utils/error.exepction';
import { HttpStatus } from '@nestjs/common/enums';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
  ) {}

  public async createProject(body: ProjectDTO): Promise<ProjectsEntity> {
    try {
      const newProject = { ...body };
      const requiredFields = ['name', 'description'];

      const missingFields = requiredFields.filter(
        (field) => !newProject[field],
      );
      if (missingFields.length > 0) {
        const errorMessage = `The following required data is missing.: ${missingFields.join(
          ', ',
        )}`;
        throw new ErrorException(errorMessage, HttpStatus.BAD_REQUEST);
      }
      return await this.projectsRepository.save(newProject);
    } catch (error) {
      throw new ErrorException(
        'Error create project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findProjects(): Promise<ProjectsEntity[]> {
    try {
      const projects: ProjectsEntity[] = await this.projectsRepository.find();
      if (projects.length === 0) {
        throw new ErrorException('No projects found', HttpStatus.NOT_FOUND);
      }
      return projects;
    } catch (error) {
      throw new ErrorException(
        'Error find projects',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findProjectById(id: string): Promise<ProjectsEntity> {
    try {
      const project: ProjectsEntity = await this.projectsRepository
        .createQueryBuilder('project')
        .where({ id })
        .getOne();
      if (!project) {
        throw new ErrorException('Project not found', HttpStatus.NOT_FOUND);
      }
      return project;
    } catch (error) {
      throw new ErrorException(
        'Error find project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateProject(
    body: UpdateProjectDTO,
    id: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const project = await this.projectsRepository.update(id, body);
      if (project.affected === 0) {
        throw new ErrorException(
          `Project can't be updated'`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return project;
    } catch (error) {
      throw new ErrorException(
        'Update Project error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteProject(id: string): Promise<DeleteResult | undefined> {
    try {
      const project = await this.projectsRepository.delete(id);
      if (project.affected === 0) {
        throw new ErrorException(
          `Project can't be deleted'`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return project;
    } catch (error) {
      throw new ErrorException(
        'Delete Project error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
