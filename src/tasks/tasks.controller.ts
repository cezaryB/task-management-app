import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  
  @Get('/:id')
  getTask(@Param('id') id:string): Task {
    return this.tasksService.getTask(id);
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (filterDto.hasOwnProperty('status') || filterDto.hasOwnProperty('search')) {
      return this.tasksService.getTasks(filterDto);
    }
    return this.tasksService.getTasks(filterDto);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/description')
  updateTask(@Param('id') id: string, @Body('description') description: string): Task {
    return this.tasksService.updateTask(id, description);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Task[] {
    return this.tasksService.deleteTask(id);
  }
}
