# Official node image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copying dependency files
COPY package.json pnpm-lock.yaml ./

# Enable pnpm
RUN corepack enable

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the project
COPY . .


# Build the app
RUN pnpm run build

# Expose app port
EXPOSE 3000

# Run production build
CMD ["node", "dist/main.js"]
