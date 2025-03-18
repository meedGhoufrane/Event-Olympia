import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from '../ticket.service';
import { getModelToken } from '@nestjs/mongoose';
import { Ticket } from '../entities/ticket.entity';
import { NotFoundException } from '@nestjs/common';

const mockTicket = {
  _id: '1',
  event: 'eventId',
  user: 'userId',
  price: 100,
  status: 'available',
};

const mockTicketModel = {
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  create: jest.fn().mockResolvedValue(mockTicket),
  exec: jest.fn().mockResolvedValue([mockTicket]),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockTicket),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockTicket),
  populate: jest.fn().mockReturnThis(),
};

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getModelToken(Ticket.name),
          useValue: mockTicketModel,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a ticket', async () => {
    const ticket = await service.create({
      eventId: 'eventId',
      userId: 'userId',
      price: 100,
      status: 'available',
    });
    expect(ticket).toEqual(mockTicket);
    expect(mockTicketModel.create).toHaveBeenCalledWith({
      event: 'eventId',
      user: 'userId',
      price: 100,
      status: 'available',
    });
  });

  it('should find all tickets', async () => {
    const tickets = await service.findAll();
    expect(tickets).toEqual([mockTicket]);
    expect(mockTicketModel.find).toHaveBeenCalled();
  });

  it('should find one ticket by id', async () => {
    mockTicketModel.findById.mockResolvedValue(mockTicket);
    const ticket = await service.findOne('1');
    expect(ticket).toEqual(mockTicket);
  });

  it('should throw NotFoundException if ticket not found', async () => {
    mockTicketModel.findById.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update a ticket', async () => {
    const updatedTicket = { ...mockTicket, price: 150 };
    mockTicketModel.findByIdAndUpdate.mockResolvedValue(updatedTicket);
    const ticket = await service.update('1', { price: 150 });
    expect(ticket).toEqual(updatedTicket);
  });

  it('should remove a ticket', async () => {
    const result = await service.remove('1');
    expect(result).toBeUndefined();
    expect(mockTicketModel.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});