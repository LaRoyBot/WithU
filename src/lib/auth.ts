import { createHash, randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = {
  admin: 'neetha_admin_session',
  employee: 'neetha_employee_session',
  customer: 'neetha_customer_session',
  customerOtp: 'neetha_customer_otp_challenge',
} as const;

export type SubjectType = 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge,
  path: '/',
});

const tokenHash = (value: string) => createHash('sha256').update(value).digest('hex');
const otpHash = (token: string, code: string) => createHash('sha256').update(`${token}:${code}`).digest('hex');

export function generateOtp(): string {
  return String(randomInt(100000, 1000000));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<{ valid: boolean; needsRehash: boolean }> {
  if (storedHash.startsWith('scrypt$')) {
    const [, salt, expectedHex] = storedHash.split('$');
    if (!salt || !expectedHex) return { valid: false, needsRehash: false };
    const actual = await scrypt(password, salt, 64) as Buffer;
    const expected = Buffer.from(expectedHex, 'hex');
    return { valid: actual.length === expected.length && timingSafeEqual(actual, expected), needsRehash: false };
  }

  // Transitional support for legacy SHA-256 hashes. A successful login upgrades it immediately.
  const legacy = tokenHash(password);
  const valid = legacy.length === storedHash.length && timingSafeEqual(Buffer.from(legacy), Buffer.from(storedHash));
  return { valid, needsRehash: valid };
}

export async function createSession(subjectType: SubjectType, subjectId: string, maxAge: number): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  await prisma.authSession.create({
    data: {
      tokenHash: tokenHash(token),
      subjectType,
      subjectId,
      expiresAt: new Date(Date.now() + maxAge * 1000),
    },
  });
  return token;
}

export async function setSession(subjectType: SubjectType, subjectId: string, maxAge: number) {
  const token = await createSession(subjectType, subjectId, maxAge);
  const cookieStore = await cookies();
  const cookieName = SESSION_COOKIE[subjectType === 'ADMIN' ? 'admin' : subjectType === 'EMPLOYEE' ? 'employee' : 'customer'];
  cookieStore.set(cookieName, token, cookieOptions(maxAge));
}

export async function revokeCurrentSession(subjectType: SubjectType) {
  const cookieStore = await cookies();
  const cookieName = SESSION_COOKIE[subjectType === 'ADMIN' ? 'admin' : subjectType === 'EMPLOYEE' ? 'employee' : 'customer'];
  const token = cookieStore.get(cookieName)?.value;
  if (token) {
    await prisma.authSession.updateMany({ where: { tokenHash: tokenHash(token), subjectType }, data: { revokedAt: new Date() } });
  }
  cookieStore.delete(cookieName);
}

async function getSubjectId(subjectType: SubjectType): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieName = SESSION_COOKIE[subjectType === 'ADMIN' ? 'admin' : subjectType === 'EMPLOYEE' ? 'employee' : 'customer'];
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;
  const session = await prisma.authSession.findFirst({
    where: { tokenHash: tokenHash(token), subjectType, revokedAt: null, expiresAt: { gt: new Date() } },
    select: { subjectId: true },
  });
  return session?.subjectId ?? null;
}

export async function getAdminIdentity() {
  const id = await getSubjectId('ADMIN');
  return id ? prisma.adminUser.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true } }) : null;
}

export async function getEmployeeIdentity() {
  const id = await getSubjectId('EMPLOYEE');
  return id ? prisma.nurse.findUnique({ where: { id }, select: { id: true, name: true, email: true, phone: true, qualification: true, baseLocation: true, isApproved: true, status: true } }) : null;
}

export async function getCustomerIdentity() {
  const id = await getSubjectId('CUSTOMER');
  return id ? prisma.customer.findUnique({ where: { id }, select: { id: true, name: true, phone: true, email: true, addressLine1: true } }) : null;
}

export async function createCustomerOtpChallenge(customerId: string, code: string, maxAge: number) {
  const token = randomBytes(32).toString('base64url');
  await prisma.otpChallenge.deleteMany({ where: { customerId } });
  await prisma.otpChallenge.create({
    data: { tokenHash: tokenHash(token), customerId, codeHash: otpHash(token, code), expiresAt: new Date(Date.now() + maxAge * 1000) },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE.customerOtp, token, cookieOptions(maxAge));
}

export async function consumeCustomerOtpChallenge(code: string): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE.customerOtp)?.value;
  if (!token) return null;
  const challenge = await prisma.otpChallenge.findFirst({ where: { tokenHash: tokenHash(token), expiresAt: { gt: new Date() } } });
  if (!challenge || challenge.attempts >= 5) return null;
  const providedHash = otpHash(token, code);
  if (!timingSafeEqual(Buffer.from(providedHash), Buffer.from(challenge.codeHash))) {
    await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } });
    return null;
  }
  await prisma.otpChallenge.delete({ where: { id: challenge.id } });
  cookieStore.delete(SESSION_COOKIE.customerOtp);
  return challenge.customerId;
}
