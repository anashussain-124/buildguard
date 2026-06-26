FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
COPY frontend/pnpm-lock.yaml ./
COPY frontend/ ./
RUN npm ci
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/.next /usr/share/nginx/html
COPY frontend/next.config.mjs /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
