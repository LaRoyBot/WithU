# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run Dev Server**: `npm run dev` (run inside `neetha-nursing-service/` directory) or `npm --prefix neetha-nursing-service run dev`
- **Build App**: `npm run build` or `npm --prefix neetha-nursing-service run build`
- **Lint**: `npm run lint` or `npm --prefix neetha-nursing-service run lint`
- **Database Push**: `npx prisma db push` (run inside `neetha-nursing-service/` directory)
- **Database Seed**: `npx prisma db seed` or `npx tsx prisma/seed.ts` (run inside `neetha-nursing-service/` directory)
- **Generate Prisma Client**: `npx prisma generate`

## Code Architecture & Project Guidelines

- **Framework**: Next.js 15 (App Router), React 19, Tailwind CSS.
- **Database**: Prisma ORM pointing to Supabase PostgreSQL.
- **Security & Privacy (DPDP Compliance)**:
  - India Digital Personal Data Protection (DPDP) Act 2023 compliance requires explicit customer consent before storing medical profiles.
  - All Patient Health Information (PHI) such as patient name, medical conditions, and special instructions are encrypted at rest using AES-256-GCM at the application level before saving. Use `encrypt` and `decrypt` from `src/lib/crypto.ts`.
  - Customer name and phone remain unencrypted to support admin panel searching/indexing.
- **Booking Flow**:
  - **Public Quick Booking**: A simplified single-step form (`QuickBookingForm` -> `createQuickBooking` action) creates bookings directly in `CONFIRMED` status.
  - **Service-specific Booking**: Starts from `/services` and redirects to `/booking/details?serviceId=...` which uses `BookingDetailsForm` and requires SMS OTP verification (`BookingConfirmForm` -> `createBookingRecord` -> `verifyBookingOtp`).
- **Third-Party Integrations**:
  - **SMS/OTP**: Msg91 integration stubbed out for local testing (OTP printed to server console logs).
  - **WhatsApp Notification**: Stubbed out in `src/lib/whatsapp.ts`.
  - **Payments**: Razorpay integration stubbed out in webhook endpoints.
