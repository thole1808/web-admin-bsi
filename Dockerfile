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

# Set variabel lingkungan untuk produksi
ENV NEXT_PUBLIC_OAUTH_AUTH_URL='http://178.128.121.255:8080/oauth2/authorize'
ENV NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL='http://178.128.121.255:8080/oauth2/token'
ENV NEXT_PUBLIC_OAUTH_CLIENT_ID='c347b983-9cb7-45ad-9e07-ee6a741018c1'
ENV NEXT_PUBLIC_OAUTH_CLIENT_SECRET='superSecretKey'
ENV NEXT_PUBLIC_OAUTH_SCOPE='branch:read reservation:read reservation:write master:read queue:read'
ENV NEXT_PUBLIC_OAUTH_CALLBACK_URL='http://localhost:3002/api/auth/callback/auth0'
ENV NEXT_PUBLIC_BACKOFFICE_ID='ca566745-a24e-482a-81b0-5dc87d59e4aa'
ENV NEXT_PUBLIC_BACKOFFICE_SCOPE='openid admin:all'

# Build aplikasi Next.js
RUN npm run build

# Tentukan port aplikasi
EXPOSE 3002

# Jalankan server Next.js dalam mode produksi
CMD ["npm", "start"]
