import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event, EventSchema } from './entities/event.entity';
import { S3Service } from 'src/core/services/S3.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
  ],
  controllers: [EventController],
  providers: [
    EventService,
    S3Service
  ],
})
export class EventModule {}