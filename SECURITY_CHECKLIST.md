# Security Checklist

High priority actions:

- Rotate any keys found in the repository and remove them from history.
- Enforce server-side input validation for all endpoints that accept external data (upload, analyze).
- Do not rely solely on LLM JSON formatting; strictly validate and sanitize all LLM-derived fields before persisting.
- Replace in-memory rate-limiting with Redis or API gateway based rate limiting for multi-instance deployments.
- Add secure cookie flags and consider using Authorization headers with short-lived tokens and refresh tokens.
- Add monitoring and alerting for suspicious activity and error spikes.

Medium priority:

- Add CSP and output escaping on frontend to reduce XSS risk.
- Ensure Supabase service role key is never used in client-side code.
- Add rate limiting and request throttling on public endpoints.

Low priority:

- Periodic secret rotation schedule.
- Penetration testing and dependency vulnerability scanning in CI.
