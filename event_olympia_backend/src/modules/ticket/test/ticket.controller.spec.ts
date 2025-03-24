import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from '../ticket.controller';
import { TicketService } from '../ticket.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { NotFoundException } from '@nestjs/common';

const mockTicketService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByEvent: jest.fn(),
  findByUser: jest.fn(),
  countTickets: jest.fn(),
  calculateTotalRevenue: jest.fn(),
};

describe('TicketController', () => {
  let controller: TicketController;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockTicketService,
        },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a ticket', async () => {
    const createTicketDto: CreateTicketDto = {
      eventId: 'eventId',
      userId: 'userId',
      price: 100,
      status: 'available',
    };
    
    const expectedResult = {
      _id: '1',
      event: 'eventId',
      user: 'userId',
      price: 100,
      status: 'available',
    };
    
    mockTicketService.create.mockResolvedValue(expectedResult);
    
    const result = await controller.create(createTicketDto, {});
    expect(result).toEqual(expectedResult);
    expect(mockTicketService.create).toHaveBeenCalledWith(createTicketDto);
  });

  it('should find all tickets', async () => {
    const mockTickets = [{ _id: '1', event: 'eventId', user: 'userId', price: 100, status: 'available' }];
    mockTicketService.findAll.mockResolvedValue(mockTickets);
    
    const result = await controller.findAll();
    expect(result).toEqual(mockTickets);
    expect(mockTicketService.findAll).toHaveBeenCalled();
  });

  it('should find one ticket by id', async () => {
    const ticket = { _id: '1', event: 'eventId', user: 'userId', price: 100, status: 'available' };
    mockTicketService.findOne.mockResolvedValue(ticket);
    
    const result = await controller.findOne('1');
    expect(result).toEqual(ticket);
    expect(mockTicketService.findOne).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if ticket not found', async () => {
    mockTicketService.findOne.mockRejectedValue(new NotFoundException());
    
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    expect(mockTicketService.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a ticket', async () => {
    const updateTicketDto = { price: 150 };
    const updatedTicket = { _id: '1', event: 'eventId', user: 'userId', price: 150, status: 'available' };
    mockTicketService.update.mockResolvedValue(updatedTicket);
    
    const result = await controller.update('1', updateTicketDto);
    expect(result).toEqual(updatedTicket);
    expect(mockTicketService.update).toHaveBeenCalledWith('1', updateTicketDto);
  });

  it('should remove a ticket', async () => {
    mockTicketService.remove.mockResolvedValue(undefined);
    
    await controller.remove('1');
    expect(mockTicketService.remove).toHaveBeenCalledWith('1');
  });

  it('should find tickets by event', async () => {
    const mockTickets = [{ _id: '1', event: 'eventId', user: 'userId', price: 100, status: 'available' }];
    mockTicketService.findByEvent.mockResolvedValue(mockTickets);
    
    const result = await controller.findByEvent('eventId');
    expect(result).toEqual(mockTickets);
    expect(mockTicketService.findByEvent).toHaveBeenCalledWith('eventId');
  });

  it('should find tickets by user', async () => {
    const mockTickets = [{ _id: '1', event: 'eventId', user: 'userId', price: 100, status: 'available' }];
    mockTicketService.findByUser.mockResolvedValue(mockTickets);
    
    const result = await controller.findByUser('userId');
    expect(result).toEqual(mockTickets);
    expect(mockTicketService.findByUser).toHaveBeenCalledWith('userId');
  });

  it('should get statistics', async () => {
    mockTicketService.countTickets.mockResolvedValue(10);
    mockTicketService.calculateTotalRevenue.mockResolvedValue(1000);
    
    const result = await controller.getStatistics();
    expect(result).toEqual({ totalTickets: 10, totalRevenue: 1000 });
    expect(mockTicketService.countTickets).toHaveBeenCalled();
    expect(mockTicketService.calculateTotalRevenue).toHaveBeenCalled();
  });
});