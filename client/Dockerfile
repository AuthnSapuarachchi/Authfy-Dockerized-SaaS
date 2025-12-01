# --- STAGE 1: Build the React App ---
FROM node:22-alpine AS build
WORKDIR /app

# 1. Copy ONLY package.json (No lock file)
COPY package.json .

# 2. Install dependencies FRESH
# We use 'npm install' without a lockfile to ensure Linux-compatible versions are fetched
RUN npm install

# 3. Copy source code
COPY . .

# 4. Build the app (will use .env if present, otherwise defaults to localhost)
# We add --max-old-space-size to prevent memory crashes during build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# --- STAGE 2: Serve with Nginx ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 5. Remove default Nginx static assets
RUN rm -rf ./*

# 6. Copy the built assets from Stage 1
COPY --from=build /app/dist .

# 7. Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 8. Expose port 80
EXPOSE 80

# 9. Start Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]