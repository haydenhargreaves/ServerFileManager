# Use a Node.js base image for building
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY /package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app using Vite
RUN npm run build

# Use a Node.js base image for serving
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built React app from the build stage
COPY --from=build /app/dist ./dist

# Copy package.json and install serve package
COPY /package.json ./
RUN npm install serve

# Expose port 3100
EXPOSE 3100

# Start the server
CMD ["npx", "serve", "-s", "dist", "-l", "3100"]


# BUILD COMMAND, from ./frontend directory
# docker build -t azpect3120/file.gophernest.frontend:latest .

