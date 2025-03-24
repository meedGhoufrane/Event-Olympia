# Event Olympia

A modern event ticketing platform built with NestJS, React, and MongoDB. This platform allows users to create, manage, and purchase tickets for various events.

## Features

- 🎫 Event Management
  - Create and manage events
  - Set ticket prices and availability
  - Upload event images
  - Track event statistics

- 👥 User Management
  - User registration and authentication
  - Profile management
  - Role-based access control
  - Password reset functionality

- 💳 Payment Integration
  - Secure payment processing with Stripe
  - Multiple payment methods support
  - Transaction history
  - Refund handling

- 🎟️ Ticket Management
  - Digital ticket generation
  - QR code for ticket validation
  - PDF ticket download
  - Ticket history tracking

- 📱 Responsive Design
  - Mobile-first approach
  - Modern UI with Mantine components
  - Dark/Light theme support
  - Optimized performance

## Tech Stack

### Backend
- NestJS (Node.js framework)
- MongoDB (Database)
- JWT Authentication
- AWS S3 (File storage)
- Stripe (Payment processing)
- Nodemailer (Email service)

### Frontend
- React with TypeScript
- Vite (Build tool)
- Mantine UI (Component library)
- React Query (Data fetching)
- React Router (Routing)
- React PDF (PDF generation)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Docker and Docker Compose (optional)
- AWS Account (for S3 storage)
- Stripe Account (for payments)

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event-olympia.git
cd event-olympia
```

2. Set up the backend:
```bash
cd event_olympia_backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run start:dev
```

3. Set up the frontend:
```bash
cd ../event-olympia-frontend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000
- MongoDB: localhost:27017

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/event_olympia
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
PORT=3000
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_bucket_name
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## API Documentation

The API documentation is available at `/api/docs` when running the backend server. It includes:
- Authentication endpoints
- Event management endpoints
- User management endpoints
- Payment processing endpoints
- Ticket management endpoints

## Testing

### Backend Tests
```bash
cd event_olympia_backend
npm run test
npm run test:e2e
npm run test:cov
```

### Frontend Tests
```bash
cd event-olympia-frontend
npm run test
```

## Deployment

### Production Deployment

1. Build the frontend:
```bash
cd event-olympia-frontend
npm run build
```

2. Build the backend:
```bash
cd event_olympia_backend
npm run build
```

3. Deploy using Docker:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Deployment Considerations

- Set up SSL/TLS certificates
- Configure proper MongoDB authentication
- Set up proper backup strategies
- Configure monitoring and logging
- Set up CI/CD pipelines

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All API endpoints are protected with JWT authentication
- Passwords are hashed using bcrypt
- File uploads are validated and sanitized
- CORS is properly configured
- Rate limiting is implemented
- Input validation is enforced

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/)
- [React](https://reactjs.org/)
- [Mantine](https://mantine.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
- [AWS](https://aws.amazon.com/)