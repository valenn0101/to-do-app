import { IsNotEmpty, IsString } from 'class-validator';
import { AuthBody } from 'src/interface/auth.interface';

export class AuthDTO implements AuthBody {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
