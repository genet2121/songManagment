# Use the official Node.js 18 image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/index

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the application using nodemon (from package.json)
CMD ["npm", "run", "dev"]
