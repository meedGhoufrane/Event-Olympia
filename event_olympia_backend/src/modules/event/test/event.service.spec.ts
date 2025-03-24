import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../event.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from '../entities/event.entity';
import { NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';

// Mock event object
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

// Define a full Event document type that includes Mongoose Document properties
type EventDocument = Document & Event;

describe('EventService', () => {
  let service: EventService;
  let eventModel: Model<Event>;

  beforeEach(async () => {
    // Create a mock factory that returns all necessary methods
    const mockEventModel = {
      // For model instance methods
      prototype: {
        save: jest.fn().mockResolvedValue(mockEvent),
      },
      // For static methods
      create: jest.fn().mockResolvedValue(mockEvent),
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockEvent]),
      }),
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockEvent),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockEvent),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEvent),
      }),
    };

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
    eventModel = module.get<Model<Event>>(getModelToken(Event.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should find all events', async () => {
    const result = await service.findAll(10);
    expect(result).toEqual([mockEvent]);
  });

  it('should find one event by id', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual(mockEvent);
  });

  it('should throw NotFoundException if event not found', async () => {
    jest.spyOn(eventModel, 'findById').mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
  });

  it('should update an event', async () => {
    const updatedEvent = { ...mockEvent, name: 'Updated Event' };
    
    // Mock findById for the image check
    jest.spyOn(eventModel, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockEvent),
    } as any);
    
    // Mock findByIdAndUpdate for the actual update
    jest.spyOn(eventModel, 'findByIdAndUpdate').mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(updatedEvent),
    } as any);

    const updateEventDto = { name: 'Updated Event' };
    const result = await service.update('1', updateEventDto);
    
    expect(result).toEqual(updatedEvent);
  });

  it('should remove an event', async () => {
    jest.spyOn(eventModel, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockEvent),
    } as any);

    await service.remove('1');
    // Success case passes if no error is thrown
  });

  it('should get statistics', async () => {
    // Create properly typed mock events
    const mockActiveEvent = { ...mockEvent, status: 'active' } as unknown as Event;
    const mockCompletedEvent = { ...mockEvent, status: 'completed' } as unknown as Event;
    const mockPlanningEvent = { ...mockEvent, status: 'planning' } as unknown as Event;
    
    // Mock the findAll method to return properly typed events
    jest.spyOn(service, 'findAll').mockResolvedValue([
      mockActiveEvent,
      mockActiveEvent,
      mockCompletedEvent,
      mockPlanningEvent
    ]);

    const stats = await service.getStatistics();
    
    expect(stats).toEqual({
      totalEvents: 4,
      activeEvents: 2,
      completedEvents: 1
    });
  });
});