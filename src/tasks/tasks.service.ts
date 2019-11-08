import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTask(id: number, user: User): Promise<Task> {
    const foundTask = this.taskRepository.findOne({ where: { id, userId: user.id } })

    if (!foundTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return foundTask;
  }

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskDescription(id: number, description: string, user: User): Promise<Task> {
    const task = await this.getTask(id, user);
    task.description = description;
    task.save();

    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<void> {
    const result =  await this.taskRepository.update({ id, userId: user.id }, { status });

    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
