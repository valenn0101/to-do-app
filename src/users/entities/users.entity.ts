import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../config/base.entity';
import { Iuser } from '../../interface/user.interface';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements Iuser {
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  age: number;
  @Column({ unique: true })
  email: string;
  @Column({ unique: true })
  username: string;
  @Exclude()
  @Column()
  password: string;
}
