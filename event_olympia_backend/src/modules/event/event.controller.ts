import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Event> {
    // If there's a file, add the file path to the DTO
    if (file) {
      createEventDto.image = `uploads/${file.filename}`;
    }
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll(@Query('limit') limit: string): Promise<Event[]> {
    return this.eventService.findAll(Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventService.findOne(id);
  }

  // In your event.controller.ts
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Event> {
    if (file) {
      updateEventDto.image = `uploads/${file.filename}`;
    }
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventService.remove(id);
  }

  @Get('statistics')
  async getStatistics() {
    return this.eventService.getStatistics();
  }
}