import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/config/base.entity';
import { Iuser } from 'src/interface/user.interface';
import { Column } from 'typeorm';

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
