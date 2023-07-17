import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../config/base.entity';
import { UserEntity } from './users.entity';
import { ProjectsEntity } from '../../projects/entity/projects.entity';

@Entity({ name: 'users_projects' })
export class UsersProjectsEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.userIncludes)
  user: UserEntity;
  @ManyToOne(() => ProjectsEntity, (project) => project.projectInclude)
  project: ProjectsEntity;
}
