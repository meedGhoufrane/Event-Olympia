import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private usersModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.usersModel({ 
      email, 
      password: hashedPassword, 
      firstName, 
      lastName 
    });
    return user.save();
  }

  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}