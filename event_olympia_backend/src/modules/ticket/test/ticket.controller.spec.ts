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
};

describe('TicketController', () => {
  let controller: TicketController;

  beforeEach(async () => {
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
    mockTicketService.create.mockResolvedValue(createTicketDto);
    const result = await controller.create(createTicketDto, {}); // Pass an empty request object
    expect(result).toEqual(createTicketDto);
  });

  it('should find all tickets', async () => {
    mockTicketService.findAll.mockResolvedValue([]);
    const result = await controller.findAll();
    expect(result).toEqual([]);
    expect(mockTicketService.findAll).toHaveBeenCalled();
  });

  it('should find one ticket by id', async () => {
    const ticket = { _id: '1', event: 'eventId', user: 'userId', price: 100, status: 'available' };
    mockTicketService.findOne.mockResolvedValue(ticket);
    const result = await controller.findOne('1');
    expect(result).toEqual(ticket);
  });

  it('should throw NotFoundException if ticket not found', async () => {
    mockTicketService.findOne.mockResolvedValue(null);
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update a ticket', async () => {
    const updateTicketDto = { price: 150 };
    const updatedTicket = { _id: '1', event: 'eventId', user: 'userId', price: 150, status: 'available' };
    mockTicketService.update.mockResolvedValue(updatedTicket);
    const result = await controller.update('1', updateTicketDto);
    expect(result).toEqual(updatedTicket);
  });

  it('should remove a ticket', async () => {
    await controller.remove('1');
    expect(mockTicketService.remove).toHaveBeenCalledWith('1');
  });
});