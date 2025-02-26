export class CreateEventDto {
  name: string;
  description: string;
  date: Date;
  createdBy: string; // User ID
  location: string;
}

export class UpdateEventDto {
  name?: string;
  description?: string;
  date?: Date;
  location?: string;
}
  