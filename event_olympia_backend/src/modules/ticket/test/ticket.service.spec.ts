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

describe('TicketService', () => {
  let service: TicketService;
  let mockTicketModel;

  beforeEach(async () => {
    mockTicketModel = {
      find: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      findByIdAndUpdate: jest.fn().mockReturnThis(),
      findByIdAndDelete: jest.fn().mockReturnThis(),
      countDocuments: jest.fn().mockReturnThis(),
      aggregate: jest.fn().mockReturnThis(),
      create: jest.fn().mockResolvedValue(mockTicket),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockTicket]),
      save: jest.fn().mockResolvedValue(mockTicket),
    };

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

  

  it('should find all tickets', async () => {
    const tickets = await service.findAll();
    
    expect(tickets).toEqual([mockTicket]);
    expect(mockTicketModel.find).toHaveBeenCalled();
    expect(mockTicketModel.populate).toHaveBeenCalledTimes(2);
  });

  it('should find one ticket by id', async () => {
    mockTicketModel.findById.mockReturnThis();
    mockTicketModel.populate.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue(mockTicket);
    
    const ticket = await service.findOne('1');
    
    expect(ticket).toEqual(mockTicket);
    expect(mockTicketModel.findById).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if ticket not found', async () => {
    mockTicketModel.findById.mockReturnThis();
    mockTicketModel.populate.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue(null);
    
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    expect(mockTicketModel.findById).toHaveBeenCalledWith('1');
  });

  it('should update a ticket', async () => {
    const updatedTicket = { ...mockTicket, price: 150 };
    mockTicketModel.findByIdAndUpdate.mockReturnThis();
    mockTicketModel.populate.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue(updatedTicket);
    
    const ticket = await service.update('1', { price: 150 });
    
    expect(ticket).toEqual(updatedTicket);
    expect(mockTicketModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { $set: { price: 150 } },
      { new: true }
    );
  });

  it('should throw NotFoundException if ticket to update not found', async () => {
    mockTicketModel.findByIdAndUpdate.mockReturnThis();
    mockTicketModel.populate.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue(null);
    
    await expect(service.update('1', { price: 150 })).rejects.toThrow(NotFoundException);
  });

  it('should remove a ticket', async () => {
    mockTicketModel.findByIdAndDelete.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue(mockTicket);
    
    await service.remove('1');
    
    expect(mockTicketModel.findByIdAndDelete).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if ticket to remove not found', async () => {
    mockTicketModel.findByIdAndDelete.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue(null);
    
    await expect(service.remove('1')).rejects.toThrow(NotFoundException);
  });

  it('should find tickets by event', async () => {
    mockTicketModel.find.mockReturnThis();
    mockTicketModel.populate.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue([mockTicket]);
    
    const tickets = await service.findByEvent('eventId');
    
    expect(tickets).toEqual([mockTicket]);
    expect(mockTicketModel.find).toHaveBeenCalledWith({ event: 'eventId' });
  });

  it('should find tickets by user', async () => {
    mockTicketModel.find.mockReturnThis();
    mockTicketModel.populate.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue([mockTicket]);
    
    const tickets = await service.findByUser('userId');
    
    expect(tickets).toEqual([mockTicket]);
    expect(mockTicketModel.find).toHaveBeenCalledWith({ user: 'userId' });
  });

  it('should count tickets', async () => {
    mockTicketModel.countDocuments.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue(10);
    
    const count = await service.countTickets();
    
    expect(count).toEqual(10);
    expect(mockTicketModel.countDocuments).toHaveBeenCalled();
  });

  it('should calculate total revenue', async () => {
    mockTicketModel.aggregate.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue([{ totalRevenue: 1000 }]);
    
    const revenue = await service.calculateTotalRevenue();
    
    expect(revenue).toEqual(1000);
    expect(mockTicketModel.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);
  });

  it('should return 0 if no tickets for total revenue calculation', async () => {
    mockTicketModel.aggregate.mockReturnThis();
    mockTicketModel.exec.mockResolvedValue([]);
    
    const revenue = await service.calculateTotalRevenue();
    
    expect(revenue).toEqual(0);
  });
});