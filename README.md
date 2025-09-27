# 💰 PFM - Personal Finance Manager

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive Personal Finance Manager built with Spring Boot and React, designed to help users track expenses, manage budgets, and achieve financial goals with enterprise-level security.

## 🌟 Features

### 💳 Financial Management
- **Multi-Account Support** - Bank accounts, credit cards, cash, investments, crypto
- **Transaction Tracking** - Income, expenses, and transfers with categories
- **Budget Management** - Periodic budgets with spending alerts
- **Financial Goals** - Savings goals, debt payoff, emergency funds
- **Recurring Transactions** - Automatic transaction scheduling
- **Multi-Currency Support** - Handle different currencies

### 🔒 Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - USER, ADMIN, PREMIUM roles
- **Password Security** - BCrypt encryption
- **Two-Factor Authentication** - Enhanced security (planned)
- **Rate Limiting** - API abuse protection
- **Data Validation** - Input sanitization and validation

### 📊 Analytics & Reporting
- **Spending Analytics** - Visual spending patterns
- **Budget Tracking** - Real-time budget vs actual spending
- **Goal Progress** - Track progress towards financial goals
- **Transaction History** - Comprehensive transaction search and filtering
- **Financial Reports** - Monthly, quarterly, yearly reports

## 🏗️ Architecture

### Backend (Spring Boot)
```
src/main/java/mra_pfm/pfm/
├── config/           # Configuration classes
├── controller/       # REST API controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── repository/      # Data access layer
├── security/        # Security configurations
└── service/         # Business logic layer
```

### Frontend (React + TypeScript)
```
pfm-client/src/
├── components/      # Reusable UI components
├── pages/          # Application pages
├── services/       # API service layer
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL 8.0** or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/mrahmanashiq/pfm.git
cd pfm
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE pfm;

-- Create user (optional)
CREATE USER 'pfm_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON pfm.* TO 'pfm_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend Setup
```bash
# Configure database connection
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit application.properties with your database credentials
nano src/main/resources/application.properties

# Build and run the backend
./gradlew bootRun
```

The backend will start on `http://localhost:8090`

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd pfm-client

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables
Create `.env` file in the root directory:

```properties
# Database Configuration
DB_URL=jdbc:mysql://localhost:3307/pfm
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Email Configuration (Optional)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Application Properties
Key configuration options in `application.properties`:

```properties
# Server Configuration
server.port=8090

# Database Configuration
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JWT Configuration
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=${JWT_EXPIRATION:86400000}
app.jwt.refresh-expiration=${JWT_REFRESH_EXPIRATION:604800000}

# CORS Configuration
app.cors.allowed-origins=${CORS_ORIGINS:http://localhost:3000}
```

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/v1/auth/signup          # User registration
POST /api/v1/auth/signin          # User login
POST /api/v1/auth/refresh         # Refresh JWT token
POST /api/v1/auth/signout         # User logout
POST /api/v1/auth/forgot-password # Password reset request
```

### Account Management
```http
GET    /api/v1/accounts           # Get user accounts
POST   /api/v1/accounts           # Create new account
GET    /api/v1/accounts/{id}      # Get account details
PUT    /api/v1/accounts/{id}      # Update account
DELETE /api/v1/accounts/{id}      # Delete account
```

### Transaction Management
```http
GET    /api/v1/transactions       # Get user transactions
POST   /api/v1/transactions       # Create new transaction
GET    /api/v1/transactions/{id}  # Get transaction details
PUT    /api/v1/transactions/{id}  # Update transaction
DELETE /api/v1/transactions/{id}  # Delete transaction
```

### Interactive API Documentation
Visit `http://localhost:8090/swagger-ui.html` when the server is running.

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
./gradlew test

# Run tests with coverage
./gradlew test jacocoTestReport

# Run integration tests
./gradlew integrationTest
```

### Frontend Tests
```bash
cd pfm-client

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Build
```bash
# Backend production build
./gradlew build -Pprod

# Frontend production build
cd pfm-client
npm run build
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Backend**: Follow Java code conventions and use Spotless for formatting
- **Frontend**: Use ESLint and Prettier configurations
- **Commits**: Follow [Conventional Commits](https://conventionalcommits.org/)

## 📋 Roadmap

### Phase 1 (Current)
- [x] Core authentication system
- [x] Account management
- [x] Basic transaction tracking
- [x] User management
- [ ] Transaction categories
- [ ] Basic budgeting

### Phase 2 (Next)
- [ ] Advanced budget management
- [ ] Financial goal tracking
- [ ] Spending analytics
- [ ] Mobile app (React Native)
- [ ] Data export/import
- [ ] Two-factor authentication

### Phase 3 (Future)
- [ ] Investment portfolio tracking
- [ ] Bill reminders
- [ ] Financial advisor integration
- [ ] Open banking API integration
- [ ] Advanced reporting
- [ ] Machine learning insights

## 🛠️ Built With

### Backend
- **[Spring Boot](https://spring.io/projects/spring-boot)** - Application framework
- **[Spring Security](https://spring.io/projects/spring-security)** - Authentication and authorization
- **[Spring Data JPA](https://spring.io/projects/spring-data-jpa)** - Data persistence
- **[MySQL](https://www.mysql.com/)** - Database
- **[JWT](https://jwt.io/)** - Token-based authentication
- **[Gradle](https://gradle.org/)** - Build automation

### Frontend
- **[React](https://reactjs.org/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Axios](https://axios-http.com/)** - HTTP client
- **[React Hook Form](https://react-hook-form.com/)** - Form management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **MRA Rahman Ashiq** - *Initial work* - [@mrahmanashiq](https://github.com/mrahmanashiq)

## 🙏 Acknowledgments

- Inspired by popular finance apps like Mint, YNAB, and PocketGuard
- Special thanks to the Spring Boot and React communities
- Icons and design inspiration from various open-source projects

## 💬 Support

- 📧 Email: [your-email@example.com](mailto:your-email@example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/mrahmanashiq/pfm/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/mrahmanashiq/pfm/discussions)

---

⭐ **Star this repo if you find it helpful!**