import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
    };
    mockUsersService.create.mockResolvedValue(createUserDto);
    const result = await controller.create(createUserDto);
    expect(result).toEqual(createUserDto);
  });

  it('should find all users', async () => {
    mockUsersService.findAll.mockResolvedValue([]);
    const result = await controller.findAll();
    expect(result).toEqual([]);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });

  it('should find one user by id', async () => {
    const user = { _id: '1', email: 'test@example.com' };
    mockUsersService.findOne.mockResolvedValue(user);
    const result = await controller.findOne('1');
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException if user not found', async () => {
    mockUsersService.findOne.mockResolvedValue(null);
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const updateUserDto = { firstName: 'Jane' };
    const updatedUser = { _id: '1', email: 'test@example.com', firstName: 'Jane' };
    mockUsersService.update.mockResolvedValue(updatedUser);
    const result = await controller.update('1', updateUserDto);
    expect(result).toEqual(updatedUser);
  });

  it('should remove a user', async () => {
    await controller.remove('1');
    expect(mockUsersService.remove).toHaveBeenCalledWith('1');
  });
});