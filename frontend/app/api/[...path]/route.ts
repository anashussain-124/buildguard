import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const buildBackendUrl = (path: string, search: string) => {
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${trimmed}${search}`;
};

const SENSITIVE_HEADERS = new Set([
  "host",
  "x-forwarded-host",
  "x-forwarded-for",
  "x-forwarded-proto",
  "x-real-ip",
  "cf-connecting-ip",
  "cf-ipcountry",
  "x-original-url",
  "x-rewrite-url",
]);

const copyHeaders = (request: Request) => {
  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (SENSITIVE_HEADERS.has(key.toLowerCase())) continue;
    headers.set(key, value);
  }
  return headers;
};

// Proxied path prefix — only these are allowed to be forwarded
const PROXIED_PATHS = new Set([
  "auth",
  "contracts",
  "analysis",
  "analyze",
  "upload",
]);

const isProxiedPath = (path: string) => {
  const firstSegment = path.split("/")[0];
  return PROXIED_PATHS.has(firstSegment);
};

const forwardRequest = async (request: Request, path: string) => {
  const search = new URL(request.url).search;
  const url = buildBackendUrl(path, search);
  const headers = copyHeaders(request);
  const init: RequestInit = {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined,
  };
  const backendResponse = await fetch(url, init);
  const responseBody = await backendResponse.arrayBuffer();
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
  });
  backendResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-length") return;
    response.headers.set(key, value);
  });
  return response;
};

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const path = params.path?.join("/") || "";
  if (!isProxiedPath(path)) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  return forwardRequest(req, path);
}

export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  const path = params.path?.join("/") || "";
  if (!isProxiedPath(path)) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  return forwardRequest(req, path);
}

export async function PUT(req: Request, { params }: { params: { path: string[] } }) {
  const path = params.path?.join("/") || "";
  if (!isProxiedPath(path)) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  return forwardRequest(req, path);
}

export async function PATCH(req: Request, { params }: { params: { path: string[] } }) {
  const path = params.path?.join("/") || "";
  if (!isProxiedPath(path)) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  return forwardRequest(req, path);
}

export async function DELETE(req: Request, { params }: { params: { path: string[] } }) {
  const path = params.path?.join("/") || "";
  if (!isProxiedPath(path)) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  return forwardRequest(req, path);
}
