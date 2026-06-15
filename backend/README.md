# Web n Code Technologies - Backend API

Backend API for the Web n Code Technologies website contact form.

## Features

- Contact form submission with validation
- MongoDB Atlas integration for data storage
- Email notifications via Nodemailer
- Admin API to retrieve all contact submissions
- CORS enabled for frontend-backend communication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account with App Password (for email notifications)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
COMPANY_EMAIL=company@example.com
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Setup Instructions

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Replace the connection string in your `.env` file

### Gmail Setup for Email Notifications

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate a new App Password
4. Use this App Password in the `.env` file as `EMAIL_PASS`
5. Set `EMAIL_USER` to your Gmail address

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 5000 (or the port specified in `.env`).

## API Endpoints

### POST /api/contact

Submit a contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 8619574703",
  "message": "I would like to inquire about your products."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "_id": "unique_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 8619574703",
    "message": "I would like to inquire about your products.",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### GET /api/contact

Get all contact submissions (Admin endpoint).

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "unique_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 8619574703",
      "message": "I would like to inquire about your products.",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Note:** In production, add authentication middleware to protect this endpoint.

## Validation Rules

- **Name**: Required, max 100 characters
- **Email**: Required, valid email format
- **Phone**: Required, max 20 characters
- **Message**: Required, max 2000 characters

## Email Notifications

When a contact form is submitted, an email is automatically sent to the company email address with:
- Subject: "New Website Enquiry"
- Body: Contains name, email, phone, message, and submission date

## Frontend Integration

The frontend is already configured to communicate with this backend at `http://localhost:5000/api/contact`.

To change the API URL in production, update the URL in `src/pages/Contact.tsx`.

## Troubleshooting

### MongoDB Connection Error
- Verify your `MONGO_URI` is correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure your database user has the correct permissions

### Email Not Sending
- Verify your Gmail App Password is correct
- Check that 2-Factor Authentication is enabled
- Ensure `EMAIL_USER` and `EMAIL_PASS` are set correctly

### CORS Errors
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check that CORS is configured correctly in `server.js`

## Project Structure

```
backend/
├── models/
│   └── Contact.js          # MongoDB schema for contact submissions
├── controllers/
│   └── contactController.js # Business logic for contact operations
├── routes/
│   └── contactRoutes.js    # API route definitions
├── server.js              # Express server setup
├── package.json           # Backend dependencies
├── .env                   # Environment variables (not in git)
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Security Notes

- Never commit `.env` file to version control
- Use strong passwords for MongoDB and Gmail
- Add authentication middleware for admin endpoints in production
- Implement rate limiting to prevent spam submissions
- Use environment variables for all sensitive data

## License

ISC
