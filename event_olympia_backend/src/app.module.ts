import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventModule } from './modules/event/event.module';
import { TicketModule } from './modules/ticket/ticket.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/default_db'),
    AuthModule,
    UsersModule,
    EventModule,
    TicketModule
  ],
})
export class AppModule {}