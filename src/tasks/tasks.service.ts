import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.tasks;

    if (status) {
      tasks = this.tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = this.tasks.filter(task => task.title.includes(search) || task.description.includes(search));
    }

    return tasks;
  }

  getTask(id: string) {
    const found = this.tasks.find(task => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const createdTask: Task = {
      title,
      description,
      id: uuid(),
      status: TaskStatus.OPEN,
    };

    this.tasks = [...this.tasks, createdTask];
    return createdTask;
  }

  updateTaskDescription(id: string, description: string): Task {
    const existingTask = this.getTask(id);

    existingTask.description = description;
    return existingTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const existingTask = this.getTask(id);

    existingTask.status = status;
    return existingTask;
  }

  deleteTask(id: string): Task[] {
    const existingTask = this.getTask(id);
    this.tasks = [...this.tasks.filter(task => task.id !== existingTask.id)];
    return this.tasks;
  }
}
