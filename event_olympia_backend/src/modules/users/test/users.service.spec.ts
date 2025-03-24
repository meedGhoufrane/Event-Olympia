import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
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
  countDocuments: jest.fn().mockResolvedValue(1),
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

 

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      jest.spyOn(userModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });

 
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(userModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedUser),
      } as any);

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateUserDto, { new: true });
    });

  
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(userModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await service.remove('1');
      expect(result).toEqual(mockUser);
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });

 
});