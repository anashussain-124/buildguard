import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ detail: "Logged out" }, { status: 200 });
  response.cookies.set({
    name: "__Host-bgai_token",
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  response.cookies.set({
    name: "__Host-bgai_refresh",
    value: "",
    path: "/api/auth/refresh",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  response.cookies.set({
    name: "__Host-csrf",
    value: "",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return response;
}
