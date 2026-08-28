import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Admin route protection
  if (path.startsWith('/admin')) {
    const adminSession = request.cookies.get('neetha_admin_session');
    const isAdminLogin = path === '/admin/login';

    if (!adminSession && !isAdminLogin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (adminSession && isAdminLogin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 2. Employee route protection (Flow 1 & Flow 2)
  if (path.startsWith('/employee')) {
    const employeeSession = request.cookies.get('neetha_employee_session');
    const isEmployeeLogin = path === '/employee/login';

    if (!employeeSession && !isEmployeeLogin) {
      return NextResponse.redirect(new URL('/employee/login', request.url));
    }

    if (employeeSession && isEmployeeLogin) {
      return NextResponse.redirect(new URL('/employee', request.url));
    }
  }

  return NextResponse.next();
}

// Config matching patterns for Admin & Employee routes
export const config = {
  matcher: ['/admin/:path*', '/employee/:path*'],
};
