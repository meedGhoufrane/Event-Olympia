import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../event/entities/event.entity';

@Schema()
export class Ticket extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  event: Event;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'available' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);