export class CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string; 
}
  
  export class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    password?: string;
    isActive?: boolean;
  }
  