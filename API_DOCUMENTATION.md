# API Documentation

## Base URL
```
http://localhost:8090/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "mobileNumber": "+1234567890",
  "address": "123 Main St, City, State"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER",
    "status": "ACTIVE",
    "emailVerified": false
  }
}
```

#### POST /auth/signin
Login with existing credentials.

**Request Body:**
```json
{
  "usernameOrEmail": "johndoe",
  "password": "securepassword123",
  "rememberMe": false
}
```

**Response:** Same as signup response.

#### POST /auth/refresh
Refresh the access token using a refresh token.

**Request Parameters:**
- `refreshToken` (string): The refresh token

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": { ... }
}
```

### User Management

#### GET /users
Get all users (Admin only).

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER",
    "status": "ACTIVE",
    "createdAt": "2025-09-26T10:00:00",
    "updatedAt": "2025-09-26T10:00:00"
  }
]
```

#### GET /users/{id}
Get user by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "mobileNumber": "+1234567890",
  "address": "123 Main St",
  "role": "USER",
  "status": "ACTIVE",
  "emailVerified": false,
  "twoFactorEnabled": false,
  "createdAt": "2025-09-26T10:00:00",
  "updatedAt": "2025-09-26T10:00:00",
  "userProfile": {
    "displayName": "John D.",
    "defaultCurrency": "USD",
    "notificationEnabled": true,
    "darkModeEnabled": false
  }
}
```

### Account Management

#### GET /accounts
Get user's accounts.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Main Checking",
    "accountType": "CHECKING",
    "balance": 2500.00,
    "initialBalance": 1000.00,
    "currency": "USD",
    "accountNumber": "****1234",
    "bankName": "Example Bank",
    "description": "Primary checking account",
    "isActive": true,
    "includeInTotal": true,
    "color": "#4CAF50",
    "icon": "bank",
    "createdAt": "2025-09-26T10:00:00",
    "updatedAt": "2025-09-26T10:00:00",
    "userId": 1
  }
]
```

#### POST /accounts
Create a new account.

**Request Body:**
```json
{
  "name": "Savings Account",
  "accountType": "SAVINGS",
  "initialBalance": 5000.00,
  "currency": "USD",
  "accountNumber": "SA-987654321",
  "bankName": "Example Bank",
  "description": "Emergency savings account",
  "color": "#2196F3",
  "icon": "savings"
}
```

**Response:** Account object (same as GET response)

#### GET /accounts/{id}
Get account by ID.

#### PUT /accounts/{id}
Update account.

**Request Body:** Same as POST /accounts

#### DELETE /accounts/{id}
Delete account.

### Transaction Management

#### GET /transactions
Get user's transactions.

**Query Parameters:**
- `page` (int): Page number (default: 0)
- `size` (int): Page size (default: 20)
- `sort` (string): Sort field (default: "transactionDate,desc")
- `startDate` (date): Filter from date (YYYY-MM-DD)
- `endDate` (date): Filter to date (YYYY-MM-DD)
- `accountId` (long): Filter by account
- `categoryId` (long): Filter by category
- `transactionType` (string): INCOME, EXPENSE, TRANSFER

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "amount": 50.00,
      "transactionType": "EXPENSE",
      "description": "Grocery shopping",
      "transactionDate": "2025-09-26",
      "currency": "USD",
      "reference": "TXN-001",
      "notes": "Weekly groceries",
      "location": "SuperMart",
      "isRecurring": false,
      "isVerified": true,
      "createdAt": "2025-09-26T10:00:00",
      "updatedAt": "2025-09-26T10:00:00",
      "userId": 1,
      "accountId": 1,
      "categoryId": 2,
      "account": {
        "id": 1,
        "name": "Main Checking"
      },
      "category": {
        "id": 2,
        "name": "Groceries",
        "categoryType": "EXPENSE"
      }
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 1,
  "totalPages": 1
}
```

#### POST /transactions
Create a new transaction.

**Request Body:**
```json
{
  "amount": 75.50,
  "transactionType": "EXPENSE",
  "description": "Gas station",
  "transactionDate": "2025-09-26",
  "currency": "USD",
  "notes": "Fill up the tank",
  "location": "Shell Station",
  "accountId": 1,
  "categoryId": 3
}
```

### Category Management

#### GET /categories
Get user's categories.

**Query Parameters:**
- `categoryType` (string): INCOME, EXPENSE, TRANSFER

**Response:**
```json
[
  {
    "id": 1,
    "name": "Food & Dining",
    "description": "Restaurants, groceries, etc.",
    "categoryType": "EXPENSE",
    "color": "#FF9800",
    "icon": "restaurant",
    "isActive": true,
    "isSystemCategory": false,
    "sortOrder": 1,
    "userId": 1,
    "subCategories": [
      {
        "id": 2,
        "name": "Groceries",
        "categoryType": "EXPENSE",
        "parentCategoryId": 1
      }
    ]
  }
]
```

### Budget Management

#### GET /budgets
Get user's budgets.

#### POST /budgets
Create a new budget.

**Request Body:**
```json
{
  "name": "Monthly Food Budget",
  "description": "Budget for food and dining",
  "amount": 500.00,
  "budgetPeriod": "MONTHLY",
  "startDate": "2025-09-01",
  "endDate": "2025-09-30",
  "currency": "USD",
  "categoryId": 1,
  "alertPercentage": 80
}
```

## Error Responses

All error responses follow this format:

```json
{
  "timestamp": "2025-09-26T10:00:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/accounts",
  "errors": [
    {
      "field": "name",
      "message": "Account name is required"
    }
  ]
}
```

### Common HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are limited to 60 requests per minute per IP address. When the limit is exceeded, you'll receive a `429 Too Many Requests` response.

## Interactive Documentation

Visit `http://localhost:8090/swagger-ui.html` for interactive API documentation with a built-in testing interface.