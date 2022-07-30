import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import assert from 'src/common/assert';
import { AuthUser } from 'src/user/user.decorator';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('data')
  @UseGuards(AuthGuard('jwt'))
  getData(@AuthUser('code') code: string) {
    return this.taskService.query(code);
  }
  
  @Put()
  @UseGuards(AuthGuard('jwt'))
  update(@Body() userDto: Task) {
    this.taskService.save(userDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@AuthUser('code') code: string, @Body() createUserDto: Task) {
    createUserDto.user_code = code;
    this.taskService.save(createUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.taskService.delete(id);
  }

  @Post('swap')
  @UseGuards(AuthGuard('jwt'))
  swap(@AuthUser('code') code: string, @Body() dto: any) {
    var ids = JSON.parse(dto.ids);
    return this.taskService.swap(code, ids);
  }
}
