# ===================================================================
# Stage 1: Build the Vite React App using Node
# ===================================================================
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies first (for faster caching)
COPY package*.json ./
RUN npm install

# Copy all other project files
COPY . .

# Accept the API URL as a build argument so we can inject the AWS IP
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the project (Vite bundles everything into the 'dist' folder)
RUN npm run build

# ===================================================================
# Stage 2: Serve the App using Nginx (Lightweight Web Server)
# ===================================================================
FROM nginx:alpine

# Copy the built HTML/JS/CSS files from Stage 1 to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]