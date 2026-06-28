# TrackIt Backend

REST API for TrackIt — a job application tracker built for students during internship season.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens) + bcrypt
- **Email:** Nodemailer + Mailgen + Mailtrap
- **Validation:** express-validator
- **File Upload:** Multer
- **Reminders:** node-cron

## Features

- JWT authentication with access/refresh tokens
- Email verification and forgot password flow
- Full CRUD for job applications with status history tracking
- Interview round notes per application
- Analytics dashboard via MongoDB aggregation pipelines
- Automated email reminders via cron job
- Search, filter, and sort applications

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/register | Register new user | ❌ |
| POST | /api/v1/auth/login | Login | ❌ |
| POST | /api/v1/auth/logout | Logout | ✅ |
| GET | /api/v1/auth/verify-email/:token | Verify email | ❌ |
| POST | /api/v1/auth/refresh-token | Refresh access token | ❌ |
| POST | /api/v1/auth/forgot-password | Request password reset | ❌ |
| POST | /api/v1/auth/reset-password/:token | Reset password | ❌ |
| GET | /api/v1/auth/current-user | Get current user | ✅ |
| POST | /api/v1/auth/change-password | Change password | ✅ |
| POST | /api/v1/auth/resend-email-verification | Resend verification email | ✅ |

### Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/applications | Create application | ✅ |
| GET | /api/v1/applications | Get all applications | ✅ |
| GET | /api/v1/applications/:applicationId | Get application by ID | ✅ |
| PATCH | /api/v1/applications/:applicationId | Update application | ✅ |
| DELETE | /api/v1/applications/:applicationId | Delete application | ✅ |

### Interview Rounds
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/applications/:applicationId/rounds | Add interview round | ✅ |
| GET | /api/v1/applications/:applicationId/rounds | Get all rounds | ✅ |
| PATCH | /api/v1/applications/:applicationId/rounds/:roundId | Update round | ✅ |
| DELETE | /api/v1/applications/:applicationId/rounds/:roundId | Delete round | ✅ |

### Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/analytics/dashboard | Get dashboard stats | ✅ |

## Environment Variables

Create a `.env` file in the root:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/jobtracker
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_pass

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
```

## Getting Started

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start
```

## Project Structure
```
src/

├── controllers/

│   ├── auth.controllers.js

│   ├── application.controllers.js

│   ├── interviewRound.controllers.js

│   └── analytics.controllers.js

├── models/

│   ├── user.models.js

│   ├── application.models.js

│   └── interviewRound.models.js

├── routes/
│   ├── auth.routes.js

│   ├── application.routes.js

│   ├── interviewRound.routes.js

│   └── analytics.routes.js

├── middlewares/

│   ├── auth.middleware.js

│   └── validator.middleware.js

├── validators/

│   └── index.js

├── utils/

│   ├── asyncHandler.js
│   ├── api-Error.js

│   ├── api-Response.js

│   ├── mail.js

│   └── reminderCron.js

├── db/

│   └── database.js

├── app.js

└── index.js
```
## Author

Priyanshu Srivastava 
