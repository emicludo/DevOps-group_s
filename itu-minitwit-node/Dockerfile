# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY itu-minitwit-node/package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY itu-minitwit-node .

# Set the environment variable PORT to 5000
ENV PORT=5000

# Expose port 3000 for the app to listen on
EXPOSE 5000

# Start the app
CMD ["npm", "start"]