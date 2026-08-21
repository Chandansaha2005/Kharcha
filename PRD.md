# Kharcha — Product Requirements Document

## 1. Product Overview

**Product Name:** Kharcha
**Product Type:** Personal Savings Tracker PWA
**Platform:** Mobile-first Progressive Web App
**Primary Users:** Individual users who want to track savings, cash/online balance, expenses, and lent money.

Kharcha is a simple personal finance PWA that helps users maintain their current savings balance. Users can track savings split between cash and online/bank balance, add balance increases or expenses, record money lent to others, and send simple repayment reminders.

The product should remain minimal and focused. It should not include complex financial analytics, budgeting, charts, subscriptions, or unnecessary advanced features in the first version.

---

## 2. Product Goal

The goal of Kharcha is to give users a clean, fast, and easy way to know:

* How much total savings they currently have.
* How much money is available in cash.
* How much money is available online/bank.
* What recent transactions changed their savings.
* Whom they have lent money to.
* When lent money is expected to be returned.

---

## 3. Core Features

### 3.1 Authentication

Users should be able to create and access their own account.

#### Requirements

* User can sign up using email and password.
* User can sign in using email and password.
* User can sign in using Google.
* User can log out from the profile page.
* Each user should only see their own data.

#### Authentication Fields

For sign up:

* Name
* Email
* Password

For sign in:

* Email
* Password

Google authentication:

* Continue with Google button

---

## 4. First-Time User Setup

After a user signs up or signs in for the first time, they should enter their starting savings balance.

### Purpose

This lets Kharcha calculate the user’s current savings from the beginning.

### Required Fields

* Current Cash Savings
* Current Online/Bank Savings

### Logic

* Total Current Savings = Cash Savings + Online/Bank Savings
* After setup completion, user should be redirected to the Home Dashboard.
* User should not see this setup screen again after completing it.

---

## 5. Home Dashboard

The Home Dashboard is the main screen of the app.

### Top Section

Display:

```text
Hello, Username
Here’s your current savings overview
```

### Main Balance Card

Display the total current savings balance in the center.

By default, the amount should be hidden:

```text
₹ ****
```

There should be an eye icon button beside the balance.

### Balance Visibility Logic

* Default state: Hidden
* Tapping the eye icon shows the balance.
* Tapping again hides the balance.
* The visibility state should apply to:

  * Total Savings
  * Cash Savings
  * Online/Bank Savings

### Balance Cards

Below the total savings, show two side-by-side cards:

1. Cash
2. Online/Bank

Both should show hidden values initially:

```text
₹ ****
```

When the user enables visibility, actual values should be shown.

### Last Transactions Section

Show the latest transactions below the balance cards.

Each transaction item should include:

* Title
* Date
* Type: Cash or Online
* Amount
* Transaction direction:

  * Balance Increase
  * Expense

### Amount Display Rules

For balance increase:

```text
+₹500
```

Use green color.

For expense:

```text
-₹120
```

Use red/orange color.

### Empty State

If there are no transactions, show:

```text
No transactions yet.
Add your first transaction to start tracking.
```

---

## 6. Add Transaction Page

This page allows the user to add either a balance increase or an expense.

### Page Purpose

Any transaction submitted from this page should immediately update the user’s current savings.

### Transaction Mode

There should be a toggle or segmented control with two options:

1. Balance Increase
2. Expense

### Required Fields

* Amount
* Title
* Description
* Type: Cash / Online
* Date

### Field Details

#### Amount

* Numeric input
* Required
* Must be greater than 0

#### Title

Examples:

* Freelance Payment
* Food Expense
* Travel
* UPI Received

#### Description

Optional text field for extra details.

#### Type

The user must select one:

* Cash
* Online

#### Date

* Default value should be today’s date.
* User can change it manually.

---

## 7. Transaction Calculation Logic

### Balance Increase

If user selects **Balance Increase**:

* Add amount to total savings.
* If type is Cash, add amount to Cash Savings.
* If type is Online, add amount to Online/Bank Savings.

Example:

```text
Current Cash = ₹1000
User adds Balance Increase of ₹500 as Cash
New Cash = ₹1500
Total Savings also increases by ₹500
```

### Expense

If user selects **Expense**:

* Subtract amount from total savings.
* If type is Cash, subtract amount from Cash Savings.
* If type is Online, subtract amount from Online/Bank Savings.

Example:

```text
Current Online = ₹2000
User adds Expense of ₹300 as Online
New Online = ₹1700
Total Savings also decreases by ₹300
```

### Validation

* Amount must be greater than 0.
* User should not be allowed to submit empty required fields.
* If expense amount is greater than the selected balance type, show a warning.

Warning example:

```text
You do not have enough balance in Cash.
```

For MVP, the transaction should not be submitted if the selected balance type has insufficient balance.

---

## 8. Lending Page

This page tracks money the user has lent to other people.

### Page Purpose

The user should be able to record money they gave to someone and track the due date for repayment.

### Add Lending Form

Required fields:

* Person Name
* Amount
* Type: Cash / Online
* Due Date

Optional field:

* Phone Number

### Lending Form Logic

When the user adds a lending entry:

* It should be saved in the lending list.
* The amount should be subtracted from the user’s current savings.
* If type is Cash, subtract from Cash Savings.
* If type is Online, subtract from Online/Bank Savings.

### Lending Entry Fields

Each lending card should show:

* Person Name
* Amount
* Type: Cash / Online
* Due Date
* Status
* Notify button

### Lending Status

MVP statuses:

* Pending
* Returned

Default status should be:

```text
Pending
```

### Mark as Returned

Each pending lending item should have an option to mark it as returned.

When marked as returned:

* Status changes to Returned.
* Amount is added back to the selected balance type.
* If type is Cash, add amount back to Cash Savings.
* If type is Online, add amount back to Online/Bank Savings.

---

## 9. SMS Notify Feature

The Lending page should include a **Notify** button.

### Purpose

The user can send a simple SMS reminder to the person who borrowed money.

### Requirement

If the lending entry has a phone number, clicking Notify should open the device’s SMS app with a pre-filled message.

### SMS Message Template

```text
Hi {PersonName}, this is a reminder that ₹{Amount} is due for repayment. Please return it by {DueDate}.
```

### Technical Behavior

Use SMS URI:

```text
sms:{phoneNumber}?body={encodedMessage}
```

### Validation

* If phone number is missing, show message:

```text
Phone number is required to send SMS reminder.
```

### Important Note

The app does not need to send SMS directly from backend in MVP. It should only open the user’s default SMS app with a pre-filled message.

---

## 10. Profile Page

The Profile page allows users to manage basic account details.

### Display

Show:

* Profile avatar placeholder
* User name
* User email
* Current Savings summary
* Edit Name option
* Logout button

### Edit Name

User should be able to update their display name.

### Logout

User should be able to log out safely.

After logout, redirect user to the Sign In screen.

---

## 11. Bottom Navigation

The app should have four main pages:

1. Home
2. Add
3. Lending
4. Profile

### Navigation Style

* Mobile-first bottom navigation
* Fixed at bottom
* Rounded floating style preferred
* Icons with labels
* Active page should be visually highlighted

---

## 12. Data Models

### 12.1 User Model

```ts
User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  setupCompleted: boolean;
}
```

---

### 12.2 Balance Model

```ts
Balance {
  userId: string;
  cashBalance: number;
  onlineBalance: number;
  totalBalance: number;
  updatedAt: Date;
}
```

`totalBalance` can also be calculated as:

```ts
cashBalance + onlineBalance
```

But for easier display, it may be stored and updated carefully.

---

### 12.3 Transaction Model

```ts
Transaction {
  id: string;
  userId: string;
  mode: "increase" | "expense";
  amount: number;
  title: string;
  description?: string;
  type: "cash" | "online";
  date: Date;
  createdAt: Date;
}
```

---

### 12.4 Lending Model

```ts
Lending {
  id: string;
  userId: string;
  personName: string;
  amount: number;
  type: "cash" | "online";
  dueDate: Date;
  phoneNumber?: string;
  status: "pending" | "returned";
  createdAt: Date;
  returnedAt?: Date;
}
```

---

## 13. Recommended Tech Stack

### Frontend

* React
* TypeScript
* Vite or Next.js
* Tailwind CSS
* Framer Motion for small transitions
* Lucide React for icons

### PWA

* Web App Manifest
* Service Worker
* Installable app support
* Mobile-first responsive layout

### Backend / Database

Recommended for MVP:

* Firebase Authentication
* Firestore Database

### Authentication

* Email/password auth
* Google auth

---

## 14. Firestore Collection Structure

```text
users/{userId}
balances/{userId}
users/{userId}/transactions/{transactionId}
users/{userId}/lendings/{lendingId}
```

Alternative:

```text
users/{userId}
users/{userId}/balance/main
users/{userId}/transactions/{transactionId}
users/{userId}/lendings/{lendingId}
```

Recommended:

```text
users/{userId}
users/{userId}/private/balance
users/{userId}/transactions/{transactionId}
users/{userId}/lendings/{lendingId}
```

This keeps all user-specific data under one user document.

---

## 15. Main User Flows

### 15.1 New User Flow

```text
Open App
→ Welcome Screen
→ Sign Up
→ First-Time Setup
→ Enter Cash and Online Savings
→ Home Dashboard
```

---

### 15.2 Existing User Flow

```text
Open App
→ Sign In
→ Home Dashboard
```

If already logged in:

```text
Open App
→ Home Dashboard
```

---

### 15.3 Add Balance Increase Flow

```text
Home
→ Add Page
→ Select Balance Increase
→ Enter Amount, Title, Description, Type, Date
→ Submit
→ Balance updates
→ Transaction appears in Last Transactions
```

---

### 15.4 Add Expense Flow

```text
Home
→ Add Page
→ Select Expense
→ Enter Amount, Title, Description, Type, Date
→ Submit
→ Balance decreases
→ Transaction appears in Last Transactions
```

---

### 15.5 Add Lending Flow

```text
Lending Page
→ Enter Person Name, Amount, Type, Due Date, Phone Number
→ Save Lending
→ Lending appears as Pending
→ Balance decreases
```

---

### 15.6 Notify Borrower Flow

```text
Lending Page
→ Click Notify
→ SMS app opens
→ Message is pre-filled
→ User manually sends SMS
```

---

### 15.7 Mark Lending as Returned Flow

```text
Lending Page
→ Select pending lending entry
→ Click Mark as Returned
→ Status changes to Returned
→ Balance increases back
```

---

## 16. UI/UX Requirements

### Visual Style

* Dark premium finance app look
* Minimal and clean layout
* Mobile-first design
* Rounded cards
* Soft shadows
* Large tap-friendly buttons
* Clear typography
* No clutter

### Color Direction

Suggested palette:

```text
Background: #0F172A
Surface/Card: #111827
Secondary Surface: #1F2937
Primary Green: #22C55E
Expense Red/Orange: #F97316
Danger Red: #EF4444
Text Primary: #F9FAFB
Text Secondary: #9CA3AF
Border: #374151
```

### Typography

Use clean modern fonts:

* Inter
* Geist
* Manrope

### UI Principles

* Balance should feel private and secure.
* Financial numbers should be easy to read.
* The app should be usable with one hand.
* Forms should be short and simple.
* Avoid unnecessary animations.

---

## 17. Privacy and Security Requirements

* User data must be private per account.
* Firestore rules should ensure users can only access their own data.
* Balances should be hidden by default on Home screen.
* Authentication state should be handled securely.
* Do not expose Firebase keys beyond normal frontend config usage.
* No public access to user financial records.

---

## 18. Firestore Security Rule Requirement

Basic rule idea:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

If balance is stored outside users collection, separate rules are required.

---

## 19. PWA Requirements

The app should be installable as a PWA.

### Required PWA Features

* App manifest
* App name: Kharcha
* Short name: Kharcha
* Theme color matching app theme
* Background color matching app theme
* App icons
* Service worker
* Offline fallback page or basic cached shell

### Manifest Example

```json
{
  "name": "Kharcha",
  "short_name": "Kharcha",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#0F172A",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 20. MVP Scope

### Included in MVP

* Sign up
* Sign in
* Google sign in
* First-time savings setup
* Home dashboard
* Hide/show savings balance
* Cash and Online balance split
* Add balance increase
* Add expense
* Last transactions list
* Lending page
* Add lending record
* Notify borrower through SMS URI
* Mark lending as returned
* Profile page
* Edit name
* Logout
* PWA install support

---

## 21. Out of Scope for MVP

The following features should not be included in the first version:

* Charts
* Budget planning
* Monthly analytics
* Categories system
* Bank account linking
* UPI integration
* Automatic SMS reading
* Direct SMS sending from backend
* Payment reminders through WhatsApp API
* PDF export
* Multi-currency support
* Shared family accounts
* Admin panel
* Subscription system
* AI suggestions

---

## 22. Edge Cases

### Transaction Edge Cases

* Empty amount should not submit.
* Negative amount should not submit.
* Expense greater than selected balance should show an error.
* Date should default to today.
* Very long title should be truncated in transaction list.

### Lending Edge Cases

* Lending amount greater than selected balance should show error.
* Notify should not work without phone number.
* Returned lending should not be marked returned multiple times.
* Returned lending should visually look completed.

### Auth Edge Cases

* Invalid email/password should show readable error.
* If user cancels Google login, stay on auth screen.
* If setup is incomplete, redirect user to setup screen.

---

## 23. Success Criteria

The MVP will be successful if:

* User can sign up/sign in.
* User can enter initial savings.
* User can see hidden total savings on home.
* User can reveal/hide savings using eye button.
* User can add income and expense transactions.
* Savings update correctly after every transaction.
* User can track money lent to others.
* User can open SMS reminder from Notify button.
* User can mark lent money as returned.
* User can edit name and logout.
* App works well on mobile as an installable PWA.

---

## 24. Suggested Development Phases

### Phase 1 — Project Setup

* Setup React/Next.js project
* Setup Tailwind CSS
* Setup routing
* Setup Firebase
* Setup PWA config

### Phase 2 — Authentication

* Sign up
* Sign in
* Google sign in
* Auth protected routes
* Logout

### Phase 3 — First-Time Setup

* Initial cash/online balance form
* Save balance to Firestore
* Redirect to Home

### Phase 4 — Home Dashboard

* Greeting
* Balance card
* Hide/show balance
* Cash/Online cards
* Last transactions list

### Phase 5 — Transactions

* Add transaction screen
* Increase/expense logic
* Firestore transaction save
* Balance update logic

### Phase 6 — Lending

* Add lending form
* Lending list
* Balance deduction
* Notify SMS URI
* Mark as returned logic

### Phase 7 — Profile

* Display user details
* Edit name
* Logout

### Phase 8 — PWA Polish

* Manifest
* Icons
* Service worker
* Mobile testing
* Install testing

---

## 25. Final Product Summary

Kharcha is a lightweight personal savings tracker PWA focused on simplicity. It helps users track total savings, cash balance, online/bank balance, income, expenses, and lent money. The app should feel fast, private, and easy to use every day.

The first version should remain intentionally minimal and avoid unnecessary finance-app complexity.
