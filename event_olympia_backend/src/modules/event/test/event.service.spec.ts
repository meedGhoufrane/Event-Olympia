import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../event.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from '../entities/event.entity';
import { NotFoundException } from '@nestjs/common';

const mockEvent = {
  _id: '1',
  name: 'Test Event',
  description: 'Test Description',
  date: new Date(),
  createdBy: 'userId',
  location: 'Test Location',
  image: 'test.jpg',
  status: 'planning',
  attendees: 0,
};

const mockEventModel = {
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  create: jest.fn().mockResolvedValue(mockEvent),
  exec: jest.fn().mockResolvedValue([mockEvent]),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockEvent),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockEvent),
  populate: jest.fn().mockReturnThis(),
};

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an event', async () => {
    const event = await service.create(mockEvent);
    expect(event).toEqual(mockEvent);
    expect(mockEventModel.create).toHaveBeenCalledWith(mockEvent);
  });

  it('should find all events', async () => {
    const events = await service.findAll();
    expect(events).toEqual([mockEvent]);
    expect(mockEventModel.find).toHaveBeenCalled();
  });

  it('should find one event by id', async () => {
    mockEventModel.findById.mockResolvedValue(mockEvent);
    const event = await service.findOne('1');
    expect(event).toEqual(mockEvent);
  });

  it('should throw NotFoundException if event not found', async () => {
    mockEventModel.findById.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update an event', async () => {
    const updatedEvent = { ...mockEvent, name: 'Updated Event' };
    mockEventModel.findByIdAndUpdate.mockResolvedValue(updatedEvent);
    const event = await service.update('1', updatedEvent);
    expect(event).toEqual(updatedEvent);
  });

  it('should remove an event', async () => {
    const result = await service.remove('1');
    expect(result).toBeUndefined();
    expect(mockEventModel.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});