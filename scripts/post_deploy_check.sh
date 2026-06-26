#!/usr/bin/env bash
set -e

FRONTEND=${FRONTEND_URL:-"https://frontend-mu-drab-54.vercel.app"}
BACKEND=${BACKEND_URL:-"https://backend-production-cfa2b.up.railway.app"}

echo "── Checking backend health ──────────────────────"
curl -sf "$BACKEND/api/health" | jq .
echo ""

echo "── Checking frontend is reachable ───────────────"
STATUS=$(curl -o /dev/null -sw "%{http_code}" "$FRONTEND")
[ "$STATUS" = "200" ] && echo "Frontend: OK ($STATUS)" || echo "Frontend: FAIL ($STATUS)"
echo ""

echo "── Checking CORS header from backend ────────────"
curl -sI -X OPTIONS "$BACKEND/api/health" \
  -H "Origin: $FRONTEND" \
  -H "Access-Control-Request-Method: GET" \
  | grep -i "access-control"
echo ""

echo "── All checks complete ───────────────────────────"
