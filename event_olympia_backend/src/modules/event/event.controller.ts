import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, UseInterceptors, UploadedFile, Req, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { Request } from '@nestjs/common';
import { multerConfig } from 'src/core/config/multer.config';
import { S3Service } from 'src/core/services/S3.service';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly s3Service: S3Service,
  ) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async create(
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request
  ) {
    const imageFile = files.image?.[0];
    if (imageFile) {
      const imageKey = `pharmacy/image/${Date.now()}-${imageFile.originalname}`;
      createEventDto.image = await this.s3Service.uploadFile(
        imageFile,
        imageKey
      )
    }
    console.log(createEventDto);
    await this.eventService.create(createEventDto);
  }

  @Get()
  findAll(@Query('limit') limit: string = '10') {
    return this.eventService.findAll(parseInt(limit));
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
    @Req() request: Request
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