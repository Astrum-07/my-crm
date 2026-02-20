import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Statik fayllar va Next.js ichki yo'llarini tekshirmasdan o'tkazib yuborish
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") ||
    pathname.includes(".") || // rasm, css, js fayllar
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  // 2. Login sahifasi uchun maxsus tekshiruv
  if (pathname === "/login") {
    // Agar foydalanuvchida token bo'lsa va u login sahifasiga kirmoqchi bo'lsa,
    // uni asosiy sahifaga yo'naltiramiz
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 3. Token yo'q bo'lsa (Auth Guard)
  // Foydalanuvchi tizimga kirmagan bo'lsa, faqat login sahifasiga ruxsat beramiz
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /** 
   * 4. Role tekshiruvi (RBAC)
   * developer - barcha sahifalarga kira oladi
   */
  
  // Managers sahifasi uchun
  if (pathname.startsWith("/managers")) {
    if (role !== "managers" && role !== "developer") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Admins sahifasi uchun
  if (pathname.startsWith("/admins")) {
    if (role !== "admins" && role !== "developer") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Boshqa barcha holatlarda davom etishga ruxsat berish
  return NextResponse.next();
}

// Config: Middleware qaysi yo'llarda ishlashini belgilash
export const config = {
  // Barcha yo'llar, lekin api, static, image va favicon'dan tashqari
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};