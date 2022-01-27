import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let result: Task[] = this.tasks.slice();

    if (status) {
      result = this.tasks.filter((task) => task.status === status);
    }

    if (search) {
      result = result.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return result;
  }

  getById(id: string): Task {
    const result = this.tasks.find((task) => task.id === id);

    if (!result) throw new NotFoundException(`Invalid ID ${id}`);

    return result;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  patchStatus(id: string, status: TaskStatus): Task {
    const target = this.getById(id);

    target.status = status;

    return target;
  }

  deleteTask(id: string): void {
    const targetIndex = this.tasks.findIndex((task) => task.id === id);

    if (targetIndex < 0) throw new NotFoundException(`Invalid ID ${id}`);

    this.tasks.splice(targetIndex, 1);
  }
}
