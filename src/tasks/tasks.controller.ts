import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/:id')
  getTask(@Param('id') id: string): Task {
    return this.tasksService.getTask(id);
  }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    if (filterDto.hasOwnProperty('status') || filterDto.hasOwnProperty('search')) {
      return this.tasksService.getTasks(filterDto);
    }
    return this.tasksService.getTasks(filterDto);
  }

  @UsePipes(ValidationPipe)
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/description')
  updateTaskDescription(@Param('id') id: string, @Body('description') description: string): Task {
    return this.tasksService.updateTaskDescription(id, description);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Task[] {
    return this.tasksService.deleteTask(id);
  }
}
