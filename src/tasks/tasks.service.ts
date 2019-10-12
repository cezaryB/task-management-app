import { Injectable } from '@nestjs/common';
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
    return this.tasks.find(task => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const createdTask: Task = {
      title,
      description,
      id: uuid(),
      status: TaskStatus.OPEN,
    }

    this.tasks = [...this.tasks, createdTask];
    return createdTask;
  }

  updateTask(id: string, description: string): Task {
    this.tasks = this.tasks.map(task => task.id === id ? { ...task, description } : task);
    return this.tasks.find(task => task.id === id);
  }

  deleteTask(id: string): Task[] {
    this.tasks = [...this.tasks.filter(task => task.id !== id)];
    return this.tasks;
  }
}
