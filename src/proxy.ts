import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	const { pathname } = request.nextUrl;

	// Protected dashboard routes - require authentication
	if (pathname.startsWith("/dashboard")) {
		if (!token) {
			const loginUrl = new URL("/auth/login", request.url);
			return NextResponse.redirect(loginUrl);
		}
		return NextResponse.next();
	}

	// Auth pages - redirect to dashboard if already logged in
	if (
		pathname.startsWith("/auth/login") ||
		pathname.startsWith("/auth/register") ||
		pathname.startsWith("/auth/forget-password") ||
		pathname.startsWith("/auth/verify-otp") ||
		pathname.startsWith("/auth/change-password")
	) {
		if (token) {
			const dashboardUrl = new URL("/dashboard", request.url);
			return NextResponse.redirect(dashboardUrl);
		}
		return NextResponse.next();
	}

	// Root path and public pages - allow all users
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|public).*)",
	],
};

