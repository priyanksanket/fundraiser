# Fundraiser App

A modern, full-stack crowdfunding platform built with **Next.js**, **Tailwind CSS**, **Prisma**, and **NextAuth.js**.

## 🚀 Features

- **Dynamic Homepage**: Browse campaigns with a sleek, responsive grid layout.
- **Advanced Filtering**:
  - Filter by categories (Medical, Education, Disaster Relief, Creative).
  - Real-time search by campaign title.
  - Sort by Newest, Most Funded, or Closing Soon.
- **Organizer Dashboard**:
  - Track your started campaigns.
  - View high-level stats (Total Raised, Total Donors).
  - **Soft Termination**: Gracefully end campaigns with a two-step confirmation flow.
- **Secure Donations**:
  - Integrated with **Stripe** for seamless payment processing.
  - Server-side guards prevent donations to fully funded or terminated campaigns.
- **User Authentication**: Secure Google Sign-In powered by **NextAuth.js**.
- **Modern UI/UX**: Built with **Tailwind CSS v4** featuring glassmorphism, smooth transitions, and responsive design.

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: MySQL / MariaDB
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Google Provider)
- **Payments**: Stripe
- **Icons**: Lucide React

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/priyanksanket/fundraiser.git
cd fundraiser
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="mysql://user:password@localhost:3306/fundraiser"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### 4. Database Initialization
```bash
npx prisma db push
npm run seed  # To populate with initial test campaigns
```

### 5. Run the development server
```bash
npm run dev
```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
