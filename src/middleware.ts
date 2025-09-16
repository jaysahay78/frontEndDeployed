import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  console.log("middleware executed")

    const authToken = request.cookies.get("token")?.value

    const loggedinUserNotAccess = request.nextUrl.pathname === "/login" || request.nextUrl.pathname == '/signup'

    if(loggedinUserNotAccess){
      //accessing not secured route
      if(authToken){
          return NextResponse.redirect(new URL("/feed", request.url));
      }
    }
    else{
      //accessing secured route
      if(!authToken){
        return NextResponse.redirect(new URL("/login",request.url))
      }
    }

  // return NextResponse.redirect(new URL('/home', request.url))

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login' ,'/user/:path*', '/signup'],
}