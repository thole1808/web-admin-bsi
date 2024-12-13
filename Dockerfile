# Gunakan image Node.js
FROM node:18-alpine

# Tentukan direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu untuk instalasi dependensi
COPY package*.json ./

# Install dependensi aplikasi dengan --legacy-peer-deps untuk mengabaikan konflik dependensi
RUN npm install --legacy-peer-deps

# Salin semua file aplikasi
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Tentukan port aplikasi
EXPOSE 3002

# Jalankan server Next.js dalam mode produksi
CMD ["npm", "start"]
