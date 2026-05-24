# ─────────────────────────────────────────────────
# Stage 1: Builder — install semua dependencies
# ─────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files dulu untuk cache layer
COPY package*.json ./

# Install semua deps (termasuk devDependencies untuk sequelize-cli)
RUN npm install

# ─────────────────────────────────────────────────
# Stage 2: Production image
# ─────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install dumb-init untuk proper process handling
RUN apk add --no-cache dumb-init

# Copy node_modules dari builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy seluruh source code
# (migrations & seeders ikut karena sequelize-cli butuh mereka)
COPY . .

# Buat folder uploads kalau tidak ada
RUN mkdir -p uploads

# Expose port yang dipakai server
EXPOSE 8080

# Pastikan entrypoint.sh bisa dieksekusi di Linux
RUN chmod +x entrypoint.sh

# Entrypoint script akan jalankan migration LALU start server
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "/app/entrypoint.sh"]
