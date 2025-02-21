export class CreateEventDto {
  name: string;
  description: string;
  date: Date;
  createdBy: string; // User ID
}

export class UpdateEventDto {
  name?: string;
  description?: string;
  date?: Date;
}
  