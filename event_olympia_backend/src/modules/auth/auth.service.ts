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
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`Password reset token for ${email}: ${resetToken}`);
      return;
    }

    try {
      console.log('Creating email transporter...');
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        debug: true, // Enable debug logging
      });

      // Verify transporter configuration
      await transporter.verify();
      console.log('Transporter verified successfully');

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

      const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following link to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>This link will expire in 1 hour.</p>
        `,
      };

      console.log('Sending email to:', email);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Detailed email sending error:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        stack: error.stack
      });
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