# Dockerfile
# Menggunakan image Node.js resmi
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Menyalin semua kode ke dalam container
COPY . .

# Build aplikasi Next.js untuk production
# RUN npm run build

# Stage 2: Menjalankan server
FROM node:18-alpine

WORKDIR /app

# Menyalin hasil build dari stage builder
COPY --from=builder /app ./

# Jalankan Next.js pada port 3000
EXPOSE 3002

# Jalankan aplikasi
CMD ["npm", "run", "start"]
