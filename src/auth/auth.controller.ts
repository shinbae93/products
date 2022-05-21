import { Body, Controller, Post, Session } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dtos/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/signup')
  async signup(@Body() body: AuthUserDto) {
    const user = await this.userService.create({
      username: body.username,
      password: body.password,
      roleId: 2,
    });
    return user;
  }

  @Post('/login')
  async login(@Body() body: AuthUserDto) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    const access_token = await this.authService.signin(user);
    return { access_token: access_token };
  }

  @Post('/logout')
  async logout(@Session() session: any) {
    session.access_token = null;
  }
}
