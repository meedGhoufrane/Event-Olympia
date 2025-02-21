import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateTicketDto {
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  status?: string;
}