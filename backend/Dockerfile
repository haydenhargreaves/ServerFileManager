# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your Express app runs on (internally only)
EXPOSE 5000

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "run", "start"]

# BUILD COMMAND, from the ./backend directory
# docker build -t azpect3120/file.gophernest.backend:latest .

# RUN COMMAND, from the ./backend directory
# The directory only matters because of the .env file
# docker run -p 5000:5000 --env-file .env -v /home/azpect:/home/azpect azpect3120/file.gophernest.backend:latest

