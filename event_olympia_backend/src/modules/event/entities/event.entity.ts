import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type EventDocument = Event & Document;

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  location: string;

  @Prop({ enum: ['active', 'completed', 'planning'], default: 'planning' })
  status: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);