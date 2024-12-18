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

# Set environment variables untuk aplikasi Anda
ENV AUTH0_DOMAIN='http://178.128.121.255:8080'
ENV AUTH0_ID='ca566745-a24e-482a-81b0-5dc87d59e4aa'
ENV AUTH0_SECRET='superSecretKey'
ENV AUTH0_SCOPES='openid admin:all'
ENV AUTH0_CALLBACK='http://178.128.121.255:3002/api/auth/callback/auth0'
ENV API_URL='http://178.128.121.255:8080/api'
ENV NEXTAUTH_URL='http://178.128.121.255:3002'
ENV NEXTAUTH_SECRET='BZKireKsyuRClywKkG2/o8sClD1d4ILIiPhbijFyF10='

# Build aplikasi Next.js
RUN npm run build

# Tentukan port aplikasi
EXPOSE 3002

# Jalankan server Next.js dalam mode produksi
CMD ["npm", "start"]
