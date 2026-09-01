import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/admin')) {
    const session = request.cookies.get('neetha_admin_session');
    if (!session && path !== '/admin/login') return NextResponse.redirect(new URL('/admin/login', request.url));
    if (session && path === '/admin/login') return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (path.startsWith('/employee')) {
    const session = request.cookies.get('neetha_employee_session');
    if (!session && path !== '/employee/login') return NextResponse.redirect(new URL('/employee/login', request.url));
    if (session && path === '/employee/login') return NextResponse.redirect(new URL('/employee', request.url));
  }
  if (path.startsWith('/customer') && path !== '/customer/login' && !request.cookies.get('neetha_customer_session')) {
    return NextResponse.redirect(new URL('/customer/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/employee/:path*', '/customer/:path*'] };
