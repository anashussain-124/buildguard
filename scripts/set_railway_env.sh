#!/usr/bin/env bash
# Usage: edit values below, then run: bash scripts/set_railway_env.sh
# Requires Railway CLI: npm install -g @railway/cli && railway login

SERVICE="backend"   # Railway service name

railway variables set \
  SUPABASE_URL="CHANGE_ME" \
  SUPABASE_ANON_KEY="CHANGE_ME" \
  SUPABASE_SERVICE_KEY="CHANGE_ME" \
  OPENROUTER_API_KEY="CHANGE_ME" \
  JWT_SECRET="$(openssl rand -hex 32)" \
  ENVIRONMENT="production" \
  ALLOWED_ORIGINS="https://frontend-mu-drab-54.vercel.app" \
  --service "$SERVICE"

echo "Done. Redeploy with: railway up --service $SERVICE"
