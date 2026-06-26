export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string; password_confirm: string };
export type UserProfile = { id: string; email: string; plan: string; credits_remaining: number; created_at: string };
export type UploadResponse = { contract_id: string; extracted_character_count: number };
export type ContractListItem = {
  id: string;
  file_name: string;
  file_size: number;
  upload_time: string;
  status: string;
  page_count: number;
  overall_risk_score?: number | null;
  risk_level?: string | null;
};
export type ContractListResponse = { items: ContractListItem[]; page: number; per_page: number; total: number };
export type AnalysisClause = {
  clause_type: string;
  extracted_text: string;
  risk_score: number;
  explanation: string;
  recommendation: string;
};
export type AnalysisRedFlag = {
  title: string;
  description: string;
  severity: string;
  location: string;
};
export type AnalysisRecord = {
  id: string;
  contract_id: string;
  user_id: string;
  created_at: string;
  overall_risk_score: number;
  risk_level: string;
  summary: string;
  clauses: AnalysisClause[];
  recommendations: string[];
  red_flags: AnalysisRedFlag[];
  missing_protections: string[];
  overall_recommendation: string;
  model_used: string;
  detected_language?: string;  // FIX: GAP-05
  language_warning?: string | null;  // FIX: GAP-05
};

const apiBase = "/api";

let csrfToken: string | null = null;

async function ensureCsrfToken(): Promise<void> {
  if (csrfToken) return;
  try {
    await fetch(`${apiBase}/auth/csrf`, { method: "GET", credentials: "include" });
    // The cookie is set by the server; we read it from document.cookie
    const match = document.cookie.match(/__Host-csrf=([^;]+)/);
    if (match) {
      csrfToken = decodeURIComponent(match[1]);
    }
  } catch {
    // CSRF token fetch failed — requests will be rejected by backend
  }
}

function getCsrfToken(): string | null {
  if (csrfToken) return csrfToken;
  const match = document.cookie.match(/__Host-csrf=([^;]+)/);
  if (match) {
    csrfToken = decodeURIComponent(match[1]);
  }
  return csrfToken;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  let body: unknown = {};

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { detail: text };
    }
  }

  // FIX: GAP-07 — Intercept X-Refreshed-Token
  // The backend sets the refreshed token as an httpOnly cookie via Set-Cookie,
  // so we do NOT write it via document.cookie (which would bypass httpOnly).
  // Stale references cleaned up; no client-side cookie write needed.

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    const detail = typeof body === "object" && body !== null && "detail" in body ? String(body.detail) : "Request failed";
    throw new Error(detail);
  }
  return body as T;
};

const needsCsrf = (method: string) => ["POST", "PUT", "PATCH", "DELETE"].includes(method);

const buildHeaders = async (method: string): Promise<Record<string, string>> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (needsCsrf(method)) {
    await ensureCsrfToken();
    const token = getCsrfToken();
    if (token) {
      headers["X-CSRF-Token"] = token;
    }
  }
  return headers;
};

export const login = async (payload: LoginRequest) => {
  return await fetch(`${apiBase}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: await buildHeaders("POST"),
    body: JSON.stringify(payload),
  }).then(handleResponse<{ access_token: string; refresh_token: string; token_type: string }>);
};

export const register = async (payload: RegisterRequest) => {
  return await fetch(`${apiBase}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: await buildHeaders("POST"),
    body: JSON.stringify(payload),
  }).then(handleResponse<{ access_token: string; refresh_token: string; token_type: string }>);
};

export const getProfile = async () => {
  return await fetch(`${apiBase}/auth/me`, { credentials: "include" }).then(handleResponse<UserProfile>);
};

export const getContracts = async (page = 1, per_page = 10) => {
  return await fetch(`${apiBase}/contracts?page=${page}&per_page=${per_page}`, { credentials: "include" }).then(handleResponse<ContractListResponse>);
};

export const uploadContract = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return await fetch(`${apiBase}/upload`, {
    method: "POST",
    credentials: "include",
    headers: await buildHeaders("POST"),
    body: formData,
  }).then(handleResponse<UploadResponse>);
};

export const analyzeContract = async (id: string) => {
  return await fetch(`${apiBase}/analyze/${id}`, {
    method: "POST",
    credentials: "include",
    headers: await buildHeaders("POST"),
  }).then(handleResponse<AnalysisRecord>);
};

export const getAnalysis = async (id: string) => {
  return await fetch(`${apiBase}/analysis/${id}`, { credentials: "include" }).then(handleResponse<AnalysisRecord>);
};

export const logout = async () => {
  return await fetch(`${apiBase}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: await buildHeaders("POST"),
  }).then(handleResponse<{ detail: string }>);
};

export const deleteContract = async (id: string) => {
  return await fetch(`${apiBase}/contracts/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: await buildHeaders("DELETE"),
  }).then(handleResponse<{ detail: string }>);
};

export const refreshToken = async () => {
  return await fetch(`${apiBase}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: await buildHeaders("POST"),
  }).then(handleResponse<{ access_token: string; refresh_token: string; token_type: string }>);
};

// FIX: GAP-03 — Revoke all active sessions
export const revokeAllSessions = async (): Promise<{ message: string }> => {
  const csrf = getCsrfToken();
  const res = await fetch(`${apiBase}/auth/revoke-all`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    let detail = "Failed to revoke sessions";
    try {
      const body = JSON.parse(text);
      detail = String(body.detail ?? detail);
    } catch {}
    throw new Error(detail);
  }
  return res.json();
};
