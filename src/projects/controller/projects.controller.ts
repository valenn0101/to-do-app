import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from '../service/projects.service';
import { ProjectDTO, UpdateProjectDTO } from '../dto/projects.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  public async createProject(@Body() body: ProjectDTO) {
    return await this.projectsService.createProject(body);
  }

  @Get('all')
  public async findAllProjects() {
    return await this.projectsService.findProjects();
  }

  @Get(':projectId')
  public async findUserById(
    @Param('projectId', new ParseUUIDPipe()) id: string,
  ) {
    return await this.projectsService.findProjectById(id);
  }

  @Put('edit/:projectId')
  public async updateUser(
    @Param('projectId', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateProjectDTO,
  ) {
    return await this.projectsService.updateProject(body, id);
  }

  @Delete('delete/:projectId')
  public async deleteUser(@Param('projectId', new ParseUUIDPipe()) id: string) {
    return await this.projectsService.deleteProject(id);
  }
}
