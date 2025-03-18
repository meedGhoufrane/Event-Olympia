import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from '../event.controller';
import { EventService } from '../event.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { NotFoundException } from '@nestjs/common';

const mockEventService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an event', async () => {
    const createEventDto: CreateEventDto = {
      name: 'Test Event',
      description: 'Test Description',
      date: new Date(),
      createdBy: 'userId',
      location: 'Test Location',
      image: 'test.jpg',
      status: 'planning',
      attendees: 0,
    };
    
    // Create a mock file object with the required 'path' property
    const mockFile = {
      fieldname: 'image',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from(''), // Mock buffer
      size: 0,
      path: 'path/to/test.jpg', // Add the required path property
    };

    mockEventService.create.mockResolvedValue(createEventDto);
    const result = await controller.create(mockFile, createEventDto); // Pass the mock file
    expect(result).toEqual(createEventDto);
  });

  it('should find all events', async () => {
    const result = await controller.findAll('10');
    expect(result).toEqual([]);
    expect(mockEventService.findAll).toHaveBeenCalled();
  });

  it('should find one event by id', async () => {
    const event = { _id: '1', name: 'Test Event' };
    mockEventService.findOne.mockResolvedValue(event);
    const result = await controller.findOne('1');
    expect(result).toEqual(event);
  });

  it('should throw NotFoundException if event not found', async () => {
    mockEventService.findOne.mockResolvedValue(null);
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update an event', async () => {
    const updateEventDto = { name: 'Updated Event' };
    
    // Create a mock file object with the required 'path' property
    const mockFile = {
      fieldname: 'image',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from(''), // Mock buffer
      size: 0,
      path: 'path/to/test.jpg', // Add the required path property
    };

    const updatedEvent = { _id: '1', ...updateEventDto };
    mockEventService.update.mockResolvedValue(updatedEvent);
    const result = await controller.update('1', mockFile, updateEventDto); // Pass the mock file
    expect(result).toEqual(updatedEvent);
  });

  it('should remove an event', async () => {
    await controller.remove('1');
    expect(mockEventService.remove).toHaveBeenCalledWith('1');
  });
});