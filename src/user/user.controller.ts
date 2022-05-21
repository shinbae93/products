import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Patch, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
@Serialize(UserDto)
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.find(parseInt(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/me')
  getCurrentUser(@Request() req: any) {
    return req.userId;
  }

  @Post()
  @Roles(Role.Admin)
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.delete(parseInt(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
