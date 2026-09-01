# WithU / Neetha Nursing Service Security Assessment

**Assessment date:** 2026-09-01  
**Method:** authenticated-code review, configuration review, dependency advisory scan. No production systems were modified and no live patient data was accessed.

## Decision

**Do not deploy or process real patient data until the Critical findings are remediated, secrets are rotated, and fixes are independently retested.** The current implementation permits unauthenticated privilege escalation, disclosure of patient data, and fraudulent payment-state changes.

## Findings

### Critical

1. **Forged session cookies grant administrative, nurse, or customer access**
   - `src/actions/admin.ts`, `src/actions/employee.ts`, and `src/actions/customer.ts` serialize identity fields as JSON into cookies and later trust `JSON.parse(cookie.value)` as the session. `src/middleware.ts` merely checks that the cookie exists.
   - A browser user can set a cookie for any account identifier/role. All admin write actions then accept that identity. The `role` field is displayed but never authorized.
   - **Fix:** replace every JSON identity cookie with a high-entropy opaque session ID stored server-side; hash session tokens at rest, enforce expiry/revocation, and load the user and permissions from the database on every request/action. Verify the session in middleware and every server action. Add role checks per action.

2. **Public booking-status URL discloses PHI and internal operational data**
   - `src/app/booking/status/page.tsx` fetches any booking supplied by `?id=` with no authorization. It renders decrypted patient name, age, gender, home address/pincode, nurse information and internal status-event notes.
   - **Fix:** require the authenticated booking owner, or issue a separate single-use/short-lived signed status token. Return indistinguishable 404 responses on failure. Never render internal notes externally.

3. **Payment webhook accepts invalid signatures and trusts attacker-controlled amounts**
   - `src/app/api/webhooks/payment/route.ts` logs a signature mismatch then continues. It has the known fallback `mock-webhook-secret` and updates `paymentStatus` and `advancePaid` directly from webhook body fields.
   - **Fix:** require a configured secret at startup, reject missing/invalid signatures before JSON processing, use constant-time comparison, make webhook handling idempotent, and reconcile the payment/order and expected amount with Razorpay's API before changing booking state.

4. **Known default credentials and cryptographic secret are in source**
   - `src/actions/admin.ts` provides a root account using `admin123`; `prisma/seed.ts` creates the same admin and multiple nurses with `nurse123`; `src/lib/crypto.ts` falls back to a published AES key. The default admin fallback remains active even when the database lookup fails.
   - **Fix:** remove all fallbacks and sample credentials from runtime code. Rotate the database credentials, all messaging/payment credentials, existing admin/nurse passwords, and the encryption key. Treat records encrypted under the default key as exposed; perform a planned re-encryption migration.

5. **Customer OTP authentication is client-controlled**
   - `src/actions/customer.ts` stores `{ customerId, otpCode, expiresAt }` in a browser cookie and verifies the user-provided code against that cookie. A user can replace it with their own valid-looking value and sign in as another customer. Sessions created afterward are also forgeable.
   - **Fix:** persist one-time challenges server-side, bind them to the phone number and a hashed OTP, apply strict expiry/attempt limits, consume them atomically, and create an opaque server-side session only after successful verification.

### High

6. **Password storage is unsuitable and there is no login throttling**
   - Admin and nurse passwords use unsalted SHA-256 in `src/actions/admin.ts`, `src/actions/employee.ts`, `src/actions/admin.ts`, and `prisma/seed.ts`. The login and OTP actions have no rate limiting, lockout, or abuse telemetry.
   - **Fix:** migrate to Argon2id (preferred) or bcrypt with a current work factor; force password resets. Rate-limit by account identifier and IP, use exponential backoff, and monitor failed attempts without logging secrets.

7. **Critical patient information is disclosed to logs and a messaging provider without an enforceable consent flow**
   - `src/lib/whatsapp.ts` logs message parameters, including OTPs, phone numbers, addresses, names, care notes and clinical details. `submitPublicBooking` writes sensitive booking data and forwards it to WhatsApp, but its input has no consent field and it sets `consentGiven: true` and `consentIpAddress: '127.0.0.1'` regardless. The legacy OTP actions also log OTPs.
   - **Fix:** immediately remove PHI/OTP logging; use structured, redacted logs with access controls and short retention. Do not send clinical details over messaging unless there is an explicit, auditable lawful basis and an approved processor agreement. Capture the actual request IP carefully through a trusted proxy configuration; do not manufacture it.

8. **No server-side authorization model or role separation**
   - All admin actions only test whether `getAdminSession()` is non-null. `SUPER_ADMIN`, `ADMIN`, and `OPERATOR` are not checked. Nurse actions trust a supplied nurse ID after cookie parsing.
   - **Fix:** create a capability matrix and enforce roles server-side for every read and mutation. Re-check current nurse approval/status from the database before presenting or changing assignments.

9. **Public booking endpoint can be abused and marks unauthenticated requests as confirmed**
   - `submitPublicBooking` accepts loosely validated input, immediately creates a `CONFIRMED` booking, sends notifications, and has no rate limit, CAPTCHA/anti-automation control, or verified payment/phone step.
   - **Fix:** validate all public inputs with a schema, create a pending state, verify the phone/payment as appropriate before dispatching work, and introduce rate limits plus bot/abuse controls.

10. **Framework dependency advisories are unresolved**
   - Installed versions: Next.js 15.5.20, its PostCSS 8.4.31, Sharp 0.34.5, and Nanoid 3.3.15. `npm audit --omit=dev --json` reports four high-severity dependency groups, including Next.js Server Action DoS/SSRF advisories, PostCSS arbitrary-file-disclosure advisories, Sharp/libvips advisories, and Nanoid DoS advisories.
   - **Fix:** upgrade Next.js and regenerate the lockfile to versions currently fixed by the advisory feed; run the production build and regression tests afterward. Do not use a blind `npm audit fix --force` on this healthcare system.

### Medium

11. **Encryption at rest fails open and is incomplete**
   - `decrypt()` returns arbitrary malformed/non-encrypted content as plaintext. `prescriptionUrl` is stored and returned in plaintext, and the key silently falls back to a published constant.
   - **Fix:** validate key material at boot and fail closed. After migration, reject malformed ciphertext. Store prescriptions in private object storage with authorization checks and short-lived download URLs; encrypt sensitive metadata where needed.

12. **Session cookies omit SameSite and there are no explicit security headers**
   - Session and OTP cookies set `httpOnly` and production `secure`, but omit `sameSite`. `next.config.ts` defines no security headers.
   - **Fix:** set `sameSite: 'lax'` (or `strict` where compatible), narrow cookie scope, set a suitable CSP, `frame-ancestors`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and HSTS at the platform edge after verifying deployment behavior.

13. **Audit trail is not a trustworthy security audit log**
   - Status events accept user-controlled notes and only sometimes associate an admin ID. Events can be viewed publicly through the status page. There is no record of access to decrypted PHI, authentication events, or security-sensitive actions.
   - **Fix:** separate customer-visible events from immutable internal audit events. Record actor ID, action, target, timestamp, request correlation ID, and outcome; restrict audit-log access and retention.

## Immediate containment order

1. Take the public deployment offline or place it behind a maintenance allow-list.
2. Rotate exposed credentials and encryption material; invalidate all existing sessions.
3. Remove the hard-coded accounts/default key and disable the public status endpoint and payment webhook until fixed.
4. Remove PHI/OTP logs and review existing log/messaging retention for potential exposure.
5. Implement server-validated sessions and authorization before restoring access.
6. Upgrade dependencies and retest all booking, payment, customer, nurse, and admin flows.

## Scope limitations

This assessment did not execute attacks against a remote deployment, inspect cloud/IAM configuration, database network policy, hosting settings, or third-party provider dashboards. Those should be assessed after the code-level blockers are remediated.
