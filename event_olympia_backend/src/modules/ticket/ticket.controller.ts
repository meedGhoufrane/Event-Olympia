import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  // Move statistics endpoint before specific routes with parameters
  @Get('statistics')
   async getStatistics() {
       const totalTickets = await this.ticketService.countTickets();
       const totalRevenue = await this.ticketService.calculateTotalRevenue();
       return { totalTickets, totalRevenue };
   }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.ticketService.findByEvent(eventId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.ticketService.findByUser(userId);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() request: any) {
    console.log('Request Headers:', request.headers);
    console.log('Creating ticket with data:', createTicketDto);

    return this.ticketService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}