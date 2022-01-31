import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './tasks-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: '123123123123123',
  username: 'tynydeedev',
  password: 'superStr0ngP@ss',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');

      const result = await tasksService.getTasks(null, mockUser);

      expect(tasksRepository.getTasks).toBeCalledWith(null, mockUser);

      expect(result).toEqual('someValue');
    });
  });

  describe('getTasksById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: '123',
        description: '123',
        id: 'someID',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskByID('someID', mockUser);

      expect(tasksRepository.findOne).toBeCalledWith({
        id: mockTask.id,
        user: mockUser,
      });

      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskByID('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
