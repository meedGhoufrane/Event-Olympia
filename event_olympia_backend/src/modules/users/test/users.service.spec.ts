import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  _id: '1',
  email: 'test@example.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
};

const mockUserModel = {
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  create: jest.fn().mockResolvedValue(mockUser),
  exec: jest.fn().mockResolvedValue([mockUser]),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create(mockUser);
    expect(user).toEqual(mockUser);
    expect(mockUserModel.create).toHaveBeenCalledWith(mockUser);
  });

  it('should find all users', async () => {
    const users = await service.findAll();
    expect(users).toEqual([mockUser]);
    expect(mockUserModel.find).toHaveBeenCalled();
  });

  it('should find one user by id', async () => {
    mockUserModel.findById.mockResolvedValue(mockUser);
    const user = await service.findOne('1');
    expect(user).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    mockUserModel.findById.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const updatedUser = { ...mockUser, firstName: 'Jane' };
    mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);
    const user = await service.update('1', { firstName: 'Jane' });
    expect(user).toEqual(updatedUser);
  });

  it('should remove a user', async () => {
    const result = await service.remove('1');
    expect(result).toBeUndefined();
    expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});