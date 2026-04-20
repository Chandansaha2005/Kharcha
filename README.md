# 💰 Kharcha - Personal Expense Tracker

![Kharcha Icon](./frontend/public/icon.png)

Kharcha is a modern, full-stack personal expense tracking web application designed to help you manage your finances with ease. Track your spending, monitor income, categorize transactions, and get daily financial summaries right in your inbox. Built with cutting-edge technologies for a seamless user experience on both desktop and mobile devices.

## ✨ Features

### 💳 Transaction Management
- **Add Transactions** - Easily add expenses and income with a user-friendly interface
- **Categorize Spending** - Organize transactions into predefined categories (Food, Transport, Entertainment, Health, Shopping, Education, Other)
- **Transaction History** - View all transactions with dates, amounts, categories, and descriptions
- **Quick Add** - Fast transaction entry with keyboard shortcuts and recent category suggestions
- **Edit & Delete** - Modify or remove transactions as needed

### 📊 Dashboard & Analytics
- **Real-Time Balance** - View your current balance updated instantly
- **Monthly Overview** - See this month's income and expense at a glance
- **Category Breakdown** - Visual pie charts showing spending by category
- **Weekly Comparison** - Track weekly spending trends and patterns
- **Frequent Spending** - Identify your most common expenses
- **Spending Charts** - Interactive charts showing spending distribution

### 📅 Calendar View
- **Daily Breakdown** - Click any date to see that day's transactions
- **Visual Calendar** - Color-coded dates showing income and expense activity
- **Month Navigation** - Switch between months to view historical data
- **Day Details** - Detailed view of all transactions for a specific day

### 💌 Email Features
- **Daily Summaries** - Automatic email with daily expense summary at 10:00 PM IST
- **Income Reminders** - Get notified about recurring income at 9:00 AM IST
- **Scheduled Reports** - Never miss your financial overview with automated emails

### 🔐 Authentication & Security
- **Magic Link Authentication** - Secure login via email (no passwords to remember)
- **JWT Tokens** - Secure API endpoints with JSON Web Tokens
- **Private Accounts** - Only authorized email can access the application
- **Session Management** - Automatic logout and session handling

### 📱 User Experience
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Progressive Web App** - Install as an app on your device
- **Dark Theme** - Eye-friendly dark interface for comfortable viewing
- **Smooth Animations** - Elegant transitions and loading states
- **Loading Skeletons** - Beautiful loading indicators while data fetches
- **Toast Notifications** - Real-time feedback for all user actions

### 🎯 Additional Features
- **Pending Expenses** - Mark expenses as pending and track them separately
- **Income Management** - Track income sources and recurring payments
- **Search & Filter** - Find transactions quickly with search functionality
- **Export Data** - View and track your financial history
- **Offline Support** - App works offline with cached data

## 📁 Project Structure

```
Kharcha/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── app.js             # Express app configuration
│   │   ├── controllers/        # Route handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth & validation
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helper functions
│   ├── .env.local.example     # Backend config template
│   └── server.js              # Server entry point
│
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # State management
│   │   ├── api/              # API client
│   │   ├── utils/            # Utilities & formatters
│   │   └── App.jsx           # Main app component
│   ├── public/               # Static assets
│   ├── .env.local.example    # Frontend config template
│   └── vite.config.js        # Vite configuration
│
└── README.md                  # This file
```

## 🚀 Installation & Setup

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MongoDB** ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local installation)
- **Git** for cloning the repository
- **Gmail Account** (for email features)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Kharcha
```

### Step 2: Backend Setup

Navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env.local` file in the `backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kharcha

# Gmail Configuration (for email features)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application Settings
OWNER_EMAIL=your-email@gmail.com
JWT_SECRET=your-random-secret-key-minimum-32-characters

# Server Configuration
PORT=5000
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```

You should see: `MongoDB connected` and `Server running on port 5000`

### Step 3: Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5174`

### Step 4: First Login

1. Open the application in your browser
2. Enter the email address you set in `OWNER_EMAIL`
3. Check your inbox for a magic link
4. Click the link to log in
5. Start tracking your expenses!

## 📋 Environment Variables

### Backend Configuration (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/kharcha` |
| `EMAIL_USER` | Gmail address for sending emails | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail app password (not regular password) | `abcd efgh ijkl mnop` |
| `OWNER_EMAIL` | Email address that can access the app | `your-email@gmail.com` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your-random-secret-key-123456789` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend Configuration (.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🔐 Security & Setup Tips

### Gmail App Password
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Find "App passwords" and create a new app password for "Mail"
4. Use this 16-character password as `EMAIL_PASS` (remove spaces)

### JWT Secret
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Important Notes
- ⚠️ Only the email in `OWNER_EMAIL` can log in
- ⚠️ Never commit `.env.local` files to git
- ⚠️ Keep `JWT_SECRET` private and secure
- ⚠️ Use strong, unique secrets for production

## ⏰ Scheduled Tasks

The application includes automated email features:

- **10:00 PM IST** - Daily expense summary email with:
  - Total daily spending
  - Category breakdown
  - Comparison with previous day
  
- **9:00 AM IST** - Recurring income reminders:
  - Upcoming income notifications
  - Payment reminders

## 📱 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Database ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Node-cron** - Task scheduling

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Date-fns** - Date utilities

## 🚀 Available Scripts

### Backend
```bash
npm start       # Start production server
npm run dev    # Start development server with nodemon
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use, you can change it:
- Backend: Modify `PORT` in `.env.local`
- Frontend: Vite will automatically use the next available port

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env.local`
- Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for development)

### Emails Not Sending
- Verify Gmail app password (not regular password)
- Ensure 2FA is enabled on Gmail
- Check OWNER_EMAIL is correct
- Verify firewall allows outgoing SMTP connections

### CORS Issues
- Ensure `VITE_API_URL` matches your backend URL
- Check backend CORS settings if modified

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Happy tracking! 💵**
