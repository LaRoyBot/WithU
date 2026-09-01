# Security deployment checklist

1. Create a tested database backup, then apply `prisma/migrations/20260901_security_hardening/migration.sql` through the normal Prisma production migration workflow.
2. Set a new `ENCRYPTION_KEY` to exactly 64 random hexadecimal characters. Do not reuse the former value; re-encrypt existing PHI under the new key before relying on it.
3. Set a new high-entropy `RAZORPAY_WEBHOOK_SECRET`, configure Razorpay with it, and verify a signed sandbox event whose amount equals the server-side order amount.
4. Create fresh administrator and nurse accounts with unique strong passwords. Reset all old administrator/nurse passwords and revoke all prior sessions.
5. Configure a real WhatsApp/SMS provider. The application now fails closed when messaging credentials are absent; never log OTPs or PHI.
6. Deploy behind HTTPS with HSTS at the load balancer/CDN. Replace the local in-memory rate limiter with a shared Redis/edge limit before running multiple instances.
7. Verify the complete flows in a non-production environment: admin login/logout, nurse approval/revocation, customer OTP login, booking OTP verification, unauthorized status access, invalid payment webhooks, and a valid payment webhook.
