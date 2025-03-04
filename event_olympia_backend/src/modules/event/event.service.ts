import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>
  ) { }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAll(limit?: number): Promise<Event[]> {
    const query = this.eventModel.find().populate('createdBy');
    if (limit) {
      query.limit(limit);
    }
    return query.exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).populate('createdBy').exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  // In your event.service.ts
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    // If we're not updating the image, don't override it
    if (!updateEventDto.image) {
      const event = await this.eventModel.findById(id).exec();
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      // Remove image field if it's not being updated
      delete updateEventDto.image;
    }

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .populate('createdBy')
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return updatedEvent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  async getStatistics() {
    const totalEvents = await this.findAll(); // Assuming this returns all events
    const activeEvents = totalEvents.filter(event => event.status === 'active').length;
    const completedEvents = totalEvents.filter(event => event.status === 'completed').length;

    return {
      totalEvents: totalEvents.length,
      activeEvents,
      completedEvents,
    };
  }
}