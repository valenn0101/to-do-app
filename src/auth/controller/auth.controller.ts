import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ErrorException } from 'src/utils/error.exepction';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthDTO } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() { username, password }: AuthDTO) {
    const userValidate = await this.authService.validateUser(
      username,
      password,
    );

    if (!userValidate) {
      throw new ErrorException(
        'Usuario o contraseña incorrecta',
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    }

    const jwt = await this.authService.generateJWT(userValidate);

    return jwt;
  }
}
