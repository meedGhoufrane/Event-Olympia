export class CreateEventDto {
  name: string;
  description: string;
  date: Date;
  createdBy: string; 
  location: string;
  image: string; 
  status: string; 
  attendees: number; 
}

// In your dto/create-event.dto.ts
export class UpdateEventDto {
  name?: string;
  description?: string;
  date?: Date;
  location?: string;
  image?: string;
  status?: string;
  attendees?: number;
}
  