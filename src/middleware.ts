import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define auth checks
  const session = request.cookies.get('neetha_admin_session');

  // If path is under /admin, secure it
  if (path.startsWith('/admin')) {
    const isLoginPage = path === '/admin/login';

    if (!session && !isLoginPage) {
      // Redirect to admin login if not logged in
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (session && isLoginPage) {
      // Redirect logged-in admin to the dashboard queue
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// Config matching pattern
export const config = {
  matcher: ['/admin/:path*'],
};
