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
  countUsers: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();
    
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
    const createdUser = { 
      _id: '1',
      ...createUserDto
    };
    
    mockUsersService.create.mockResolvedValue(createdUser);
    
    const result = await controller.create(createUserDto);
    expect(result).toEqual(createdUser);
    expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should find all users', async () => {
    const users = [{ _id: '1', email: 'test@example.com' }];
    mockUsersService.findAll.mockResolvedValue(users);
    
    const result = await controller.findAll();
    expect(result).toEqual(users);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });

  it('should find one user by id', async () => {
    const user = { _id: '1', email: 'test@example.com' };
    mockUsersService.findOne.mockResolvedValue(user);
    
    const result = await controller.findOne('1');
    expect(result).toEqual(user);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
  });

  it('should throw an error if user not found', async () => {
    mockUsersService.findOne.mockRejectedValue(new NotFoundException('User with ID 1 not found'));
    
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const updateUserDto = { email: 'updated@example.com' };
    const updatedUser = { _id: '1', email: 'updated@example.com' };
    mockUsersService.update.mockResolvedValue(updatedUser);
    
    const result = await controller.update('1', updateUserDto);
    expect(result).toEqual(updatedUser);
    expect(mockUsersService.update).toHaveBeenCalledWith('1', updateUserDto);
  });

  it('should remove a user', async () => {
    const deletedUser = { _id: '1', email: 'test@example.com' };
    mockUsersService.remove.mockResolvedValue(deletedUser);
    
    const result = await controller.remove('1');
    expect(result).toEqual(deletedUser);
    expect(mockUsersService.remove).toHaveBeenCalledWith('1');
  });

  it('should get user statistics', async () => {
    mockUsersService.countUsers.mockResolvedValue(5);
    
    const result = await controller.getStatistics();
    expect(result).toEqual({ totalUsers: 5 });
    expect(mockUsersService.countUsers).toHaveBeenCalled();
  });

  it('should get current user profile', async () => {
    const user = { _id: '123', email: 'test@example.com' };
    mockUsersService.findOne.mockResolvedValue(user);
    
    const req = { user: { userId: '123' } };
    const result = await controller.getMe(req);
    
    expect(result).toEqual(user);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('123');
  });

  it('should handle errors when fetching current user profile', async () => {
    mockUsersService.findOne.mockRejectedValue(new Error('Database error'));
    
    const req = { user: { userId: '123' } };
    await expect(controller.getMe(req)).rejects.toThrow('Failed to fetch user data: Database error');
  });
});