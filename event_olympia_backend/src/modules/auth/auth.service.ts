// src/modules/auth/auth.service.ts
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private usersModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async register(email: string, password: string, firstName?: string, lastName?: string, role: string = 'user'): Promise<User> {
    const existingUser = await this.usersModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.usersModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });
    return user.save();
  }

  async login(email: string, password: string) {
    const user = await this.usersModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const payload = { email: user.email, userId: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      user_id: user._id,
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = uuidv4();
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); 
    await user.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`Password reset token for ${email}: ${resetToken}`);
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://localhost:3000/auth/reset-password/${resetToken}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new InternalServerErrorException('Failed to send password reset email. Please contact support.');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersModel.findOne({ resetToken: token, resetTokenExpiration: { $gt: new Date() } });
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  }
}