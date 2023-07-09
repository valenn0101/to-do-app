import { Module } from '@nestjs/common';
import { ProjectsController } from './controller/projects.controller';
import { ProjectsService } from './service/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEntity } from './entity/projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsEntity])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
