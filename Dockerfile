# Build the client app
FROM node:20-alpine AS build
WORKDIR /app

# Copy only client package files first (for faster caching)
COPY client/package*.json ./

RUN npm ci

# Copy the rest of the client source code
COPY client/ ./

RUN npm run build

# Serve static files with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]