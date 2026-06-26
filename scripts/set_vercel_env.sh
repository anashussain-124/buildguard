#!/usr/bin/env bash
# Requires Vercel CLI: npm i -g vercel && vercel login

echo "NEXT_PUBLIC_API_URL=https://backend-production-cfa2b.up.railway.app" \
  | vercel env add NEXT_PUBLIC_API_URL production

echo "Vercel env set. Redeploy with: vercel --prod"
