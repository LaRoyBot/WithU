import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const path = request.nextUrl.pathname;

  // Clone headers to pass down the detected host to Server Components
  const requestHeaders = new Headers(request.headers);
  const isSubdomainPortal = host.startsWith('n.') || request.nextUrl.searchParams.has('portal');
  requestHeaders.set('x-is-portal', isSubdomainPortal ? 'true' : 'false');

  // If user visits the root page on apex domain (neethanursing.in / www), rewrite internally to /classic
  if (path === '/' && !isSubdomainPortal) {
    const url = request.nextUrl.clone();
    url.pathname = '/classic';
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Admin session authentication guard
  if (path.startsWith('/admin')) {
    const session = request.cookies.get('neetha_admin_session');
    if (!session && path !== '/admin/login') return NextResponse.redirect(new URL('/admin/login', request.url));
    if (session && path === '/admin/login') return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Employee session authentication guard
  if (path.startsWith('/employee')) {
    const session = request.cookies.get('neetha_employee_session');
    if (!session && path !== '/employee/login') return NextResponse.redirect(new URL('/employee/login', request.url));
    if (session && path === '/employee/login') return NextResponse.redirect(new URL('/employee', request.url));
  }

  // Customer session authentication guard
  if (path.startsWith('/customer') && path !== '/customer/login' && !request.cookies.get('neetha_customer_session')) {
    return NextResponse.redirect(new URL('/customer/login', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = { matcher: ['/', '/admin/:path*', '/employee/:path*', '/customer/:path*'] };
