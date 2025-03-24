import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>
  ) { }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const ticket = new this.ticketModel({
      event: createTicketDto.eventId,
      user: createTicketDto.userId,
      price: createTicketDto.price,
      status: createTicketDto.status,
    });
    return ticket.save();
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find()
      .populate('event')
      .populate('user')
      .exec();
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(id)
      .populate('event')
      .populate('user')
      .exec();
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(
        id,
        { $set: updateTicketDto },
        { new: true }
      )
      .populate('event')
      .populate('user')
      .exec();
  
    if (!updatedTicket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return updatedTicket;
  }

  async remove(id: string): Promise<void> {
    const result = await this.ticketModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
  }

  async findByEvent(eventId: string): Promise<Ticket[]> {
    return this.ticketModel.find({ event: eventId })
      .populate('event')
      .populate('user')
      .exec();
  }

  async findByUser(userId: string): Promise<Ticket[]> {
    return this.ticketModel.find({ user: userId })
      .populate('event')
      .populate('user')
      .exec();
  }

  async countTickets(): Promise<number> {
    return this.ticketModel.countDocuments().exec();
  }

  async calculateTotalRevenue(): Promise<number> {
    const result = await this.ticketModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" }
        }
      }
    ]).exec();
    
    return result.length > 0 ? result[0].totalRevenue : 0;
  }
}