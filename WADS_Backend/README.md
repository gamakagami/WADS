# Semesta Medika Backend

A comprehensive healthcare management system backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Management**
  - Authentication (JWT & Google OAuth)
  - Role-based access control (Admin, Doctor, Patient)
  - User profile management

- **Ticket System**
  - Create and manage support tickets
  - Priority levels and categories
  - Department assignment
  - Status tracking

- **AI Chatbot**
  - Product information assistance
  - Intelligent responses using Google's Gemini AI
  - Chat history tracking
  - Message categorization and metadata
  - Multi-language support

- **Notification System**
  - Real-time notifications
  - Email notifications
  - Customizable notification preferences
  - Multiple notification types (appointments, tickets, system alerts)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: 
  - JWT (JSON Web Tokens)
  - Passport.js
  - Google OAuth2.0
  - Two-Factor Authentication (2FA)
  - Refresh Token System
- **AI Integration**:
  - Google Gemini AI
- **Real-time**: Socket.IO
- **Documentation**: Swagger/OpenAPI
- **Security**: 
  - Helmet.js
  - CORS
  - Rate limiting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials
- npm or yarn

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/semesta-medika-backend.git
   cd semesta-medika-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=your_mongodb_uri

   # JWT Configuration
   JWT_SECRET=your_jwt_secret

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

4. Start the server:
   ```bash
   npm start
   ```

## 📚 API Documentation

API documentation is available via Swagger UI at:
```
http://localhost:5000/api-docs
```

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests
- Chatbot interaction examples

## 🔐 Authentication

The API supports multiple authentication methods:

1. **JWT Authentication**
   - Used for regular email/password login
   - Token must be included in Authorization header
   - Format: `Bearer <token>`
   - Includes refresh token system for extended sessions
   - Refresh tokens can be used to obtain new access tokens

2. **Two-Factor Authentication (2FA)**
   - Optional 2FA using authenticator apps (Google Authenticator, Authy)
   - QR code generation for easy setup
   - Secure token validation
   - Backup codes for account recovery
   - Can be enabled/disabled by users

3. **Google OAuth**
   - Enables "Sign in with Google"
   - Requires valid Google OAuth credentials
   - Automatically creates user account on first login

### Authentication Endpoints
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Get new access token using refresh token
- `POST /api/2fa/setup` - Set up 2FA
- `POST /api/2fa/verify` - Verify 2FA code
- `POST /api/2fa/disable` - Disable 2FA
- `POST /api/2fa/generate-backup-codes` - Generate backup codes

## 🚦 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Chat
- `POST /api/chat` - Send message to AI chatbot
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/:chatId` - Delete chat message
- `PATCH /api/chat/:chatId` - Update chat message

### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/preferences` - Update notification preferences

## 🤖 Chatbot Features

The AI chatbot provides intelligent responses about Semesta Medika's products and services:

### Product Information
- Detailed pricing information
- Product features and specifications
- Use cases and applications
- Product categories:
  - Hospital Products
  - Homecare Products
  - Ward Furnitures

### Chat Functionality
- Real-time AI responses
- Message history tracking
- Message categorization
- Sentiment analysis
- Language detection (English/Indonesian)
- Product category detection

### Example Chat Interaction
```json
// Request
POST /api/chat
{
  "message": "What is the price of the U-life Mobile Cart?",
  "messageType": "product"
}

// Response
{
  "success": true,
  "chatId": "507f1f77bcf86cd799439011",
  "response": "The U-life Mobile Cart is priced at Rp 4.900.000. It features a mobile workstation with adjustable height, laptop holder, and cable management, perfect for hospital wards, clinics, and medical offices.",
  "metadata": {
    "messageType": "product",
    "productCategory": "Hospital Products"
  }
}
```

## 🔄 Error Handling

The API uses standard HTTP status codes:
- `2xx` - Success
- `4xx` - Client errors
- `5xx` - Server errors

Detailed error messages are provided in the response body.

## 🛡️ Security

- CORS enabled
- Rate limiting implemented
- Helmet.js for security headers
- Password hashing
- JWT token encryption
- Input validation
- MongoDB injection prevention

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@semestamedika.com or create an issue in the repository. 
