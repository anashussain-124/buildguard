import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_COOKIE_NAME = "__Host-bgai_token";
const CSRF_COOKIE_NAME = "__Host-csrf";

async function fetchBackend(path: string, init: RequestInit) {
  const res = await fetch(`${BACKEND_URL}${path}`, init);
  const text = await res.text();
  let body: any = text;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = text;
  }
  return { res, body, text };
}

export async function POST(req: Request, { params }: { params: { action: string } }) {
  const action = params.action;
  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;

  if (action !== "login" && action !== "register") {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  if (!body) {
    return NextResponse.json({ detail: "Missing request body" }, { status: 400 });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const { res, body: responseBody } = await fetchBackend(`/auth/${action}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const response = NextResponse.json(responseBody, { status: res.status });
  if (res.ok && responseBody?.access_token) {
    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: responseBody.access_token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    });
    if (responseBody.refresh_token) {
      response.cookies.set({
        name: "__Host-bgai_refresh",
        value: responseBody.refresh_token,
        path: "/api/auth/refresh",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
  }
  return response;
}

export async function GET(req: Request, { params }: { params: { action: string } }) {
  const action = params.action;
  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;

  if (action === "me") {
    if (!token) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const { res, body } = await fetchBackend(`/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(body, { status: res.status });
  }

  if (action === "csrf") {
    const { res, body } = await fetchBackend("/auth/csrf", {
      method: "GET",
      headers: {},
    });
    return NextResponse.json(body, { status: res.status });
  }

  if (action === "refresh") {
    const refreshToken = cookies().get("__Host-bgai_refresh")?.value;
    if (!refreshToken) {
      return NextResponse.json({ detail: "No refresh token" }, { status: 401 });
    }

    const { res, body: responseBody } = await fetchBackend("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const response = NextResponse.json(responseBody, { status: res.status });
    if (res.ok && responseBody?.access_token) {
      response.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: responseBody.access_token,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
      });
      if (responseBody.refresh_token) {
        response.cookies.set({
          name: "__Host-bgai_refresh",
          value: responseBody.refresh_token,
          path: "/api/auth/refresh",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60,
        });
      }
    }
    return response;
  }

  return NextResponse.json({ detail: "Not found" }, { status: 404 });
}

export async function PATCH() {
  return NextResponse.json({ detail: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ detail: "Method not allowed" }, { status: 405 });
}
