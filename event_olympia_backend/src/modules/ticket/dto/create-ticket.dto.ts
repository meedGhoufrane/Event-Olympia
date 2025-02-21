import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  eventId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  price: number;

  @IsString()
  status: string;
}

export class UpdateTicketDto {
  @IsNumber()
  price?: number;

  @IsString()
  status?: string;
}