# WithU — Healthcare & Home Nursing Care Platform

An open-source, modern web application for home nursing, post-surgical care, and patient assistance services built with **Next.js**, **Tailwind CSS**, and **Prisma**.

---

## 🌟 Key Features

- **Quick Booking System**: Streamlined patient booking form with real-time validation.
- **Admin Calendar Slots View**: Interactive slot management for healthcare staff and appointment scheduling.
- **Service Directory**: Comprehensive listings for home nursing, IV drip administration, post-surgical care, and elderly assistance.
- **WhatsApp Integration**: Floating action button and direct support triggers for instant patient inquiry.
- **Responsive Brand Design**: Custom purple-themed UI designed for mobile and desktop accessibility.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database / ORM**: [Prisma](https://www.prisma.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have **Node.js 18+** and **npm** installed:

```bash
node -v
npm -v
```

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/LaRoyBot/WithU.git
cd WithU
npm install
```

### 3. Database Setup

Initialize Prisma database schema:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```text
WithU/
├── prisma/               # Database schema and migration files
├── public/               # Static assets and brand imagery
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   ├── components/       # UI components (Booking, Admin, Navigation)
│   └── lib/              # Shared utilities and database client
├── tailwind.config.ts    # Tailwind styling configuration
└── tsconfig.json         # TypeScript configuration
```

---

## 📄 License

MIT License — Created and maintained by [LaRoyBot](https://github.com/LaRoyBot).
