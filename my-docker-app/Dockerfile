# Use an official Node.js runtime as the base image
FROM node:18

# Create a directory for the app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Define the command to run the app
CMD ["node", "server.js"]
