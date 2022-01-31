import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/users.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './tasks-status.enum';
import { Task } from './tasks.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskByID(id: string, user: User): Promise<Task> {
    let result: Task;

    try {
      result = await this.tasksRepository.findOne({ id, user });
    } catch (error) {
      if (error.message.includes('uuid')) {
        throw new BadRequestException('Invalid ID');
      }
    }

    if (!result) throw new NotFoundException(`Invalid ID: ${id}`);

    return result;
  }

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task: Task = await this.getTaskByID(id, user);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<Task> {
    const task: Task = await this.getTaskByID(id, user);

    return this.tasksRepository.remove(task);
  }
}
