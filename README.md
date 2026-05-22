# EventSync Backend API

Backend API untuk EventSync - Event Coordination Platform

## Setup Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Run SQL migrations
npx sequelize-cli db:migrate

# Seed demo data (optional)
npx sequelize-cli db:seed:all
```

### 3. Environment Configuration
Konfigurasi `.env` di root project dengan:
- Database credentials (MySQL)
- MongoDB connection string dan mode startup (`MONGO_MODE=full` sebagai default)
- JWT secret
- Google Cloud Storage config (optional)
- CORS allowed origins

### 4. Start Development Server
```bash
npm run dev
```

Server akan run di `http://localhost:8080`

## API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication
Gunakan JWT token di header:
```
Authorization: Bearer <token>
```

Semua request JSON menggunakan header:
```http
Content-Type: application/json
```

### Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": { "page": 1, "per_page": 10, "total": 100 }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    { "field": "email", "message": "Email already exists" }
  ]
}
```

### Pagination Meta
Jika endpoint mendukung pagination, response sukses akan menyertakan `meta`:
```json
{
  "page": 1,
  "per_page": 10,
  "total": 25,
  "total_pages": 3
}
```

## Frontend API Reference

### 1. Auth Endpoints

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/auth/register` | No | `name`, `email`, `password`, `role`, `divisi?`, `phone?`, `avatar_url?` |
| POST | `/auth/login` | No | `email`, `password` |
| GET | `/auth/me` | Yes | - |
| POST | `/auth/logout` | Yes | - |

Contoh payload login:
```json
{
  "email": "admin@eventsync.local",
  "password": "admin123"
}
```

Contoh response login:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "jwt-token",
    "expires_in": "24h",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@eventsync.local",
      "role": "admin"
    }
  }
| GET | `/users/:id` | Yes | Auth only | - |
| PUT | `/users/:id` | Yes | `admin`, `ketua` | `name?`, `phone?`, `avatar_url?`, `divisi?`, `is_active?` |
|---|---|---|---|---|
| POST | `/events` | Yes | `admin`, `ketua` | `nama_event`, `deskripsi?`, `lokasi?`, `tanggal_mulai`, `tanggal_selesai`, `status?`, `ketua_id?` |
| GET | `/events` | Yes | Auth only | `page?`, `per_page?`, `q?`, `status?`, `ketua_id?`, `tanggal_mulai_from?`, `tanggal_mulai_to?`, `sort_by?`, `order?` |
| GET | `/events/:id` | Yes | Auth only | - |
### 4. Vendor Management

| Method | Endpoint | Auth | Role | Body |
|---|---|---|---|---|
| POST | `/events/:id/vendors` | Yes | `admin`, `ketua` | `nama_vendor`, `kategori?`, `kontak_person?`, `telepon?`, `email?`, `alamat?`, `kontrak_url?`, `status?`, `catatan?` |
| GET | `/events/:id/vendors` | Yes | Auth only | `page?`, `per_page?`, `q?`, `status?`, `kategori?`, `sort_by?`, `order?` |
| GET | `/vendors/:id` | Yes | Auth only | - |
| PUT | `/vendors/:id` | Yes | `admin`, `ketua` | `nama_vendor?`, `kategori?`, `kontak_person?`, `telepon?`, `email?`, `alamat?`, `kontrak_url?`, `status?`, `catatan?` |
| DELETE | `/vendors/:id` | Yes | `admin`, `ketua` | - |

### 5. Rundown Management

| Method | Endpoint | Auth | Role | Body |
|---|---|---|---|---|
| POST | `/events/:id/rundowns` | Yes | `admin`, `ketua` | `urutan`, `waktu_mulai`, `waktu_selesai?`, `judul_sesi`, `deskripsi?`, `pic_id?`, `vendor_id?`, `status?` |
| GET | `/events/:id/rundowns` | Yes | Auth only | `page?`, `per_page?`, `q?`, `status?`, `pic_id?`, `vendor_id?`, `sort_by?`, `order?` |
| PUT | `/rundowns/:id` | Yes | `admin`, `ketua` | `urutan?`, `waktu_mulai?`, `waktu_selesai?`, `judul_sesi?`, `deskripsi?`, `pic_id?`, `vendor_id?`, `status?` |
| DELETE | `/rundowns/:id` | Yes | `admin`, `ketua` | - |

### 6. Task Management (Tugas)

| Method | Endpoint | Auth | Role | Body |
|---|---|---|---|---|
| POST | `/events/:id/tugas` | Yes | `admin`, `ketua` | `judul`, `deskripsi?`, `assignee_id`, `divisi?`, `prioritas?`, `status?`, `deadline?`, `lampiran_url?`, `catatan?`, `rundown_id?` |
| GET | `/events/:id/tugas` | Yes | Auth only | `page?`, `per_page?`, `q?`, `status?`, `prioritas?`, `assignee_id?`, `divisi?`, `sort_by?`, `order?` |
| GET | `/tugas/:id` | Yes | Auth only | - |
| PUT | `/tugas/:id` | Yes | Auth only | `judul?`, `deskripsi?`, `assignee_id?`, `divisi?`, `prioritas?`, `status?`, `deadline?`, `lampiran_url?`, `catatan?` |
| PATCH | `/tugas/:id/status` | Yes | Auth only | `status`, `catatan?` |
| DELETE | `/tugas/:id` | Yes | `admin`, `ketua` | - |

### 7. Laporan

| Method | Endpoint | Auth | Role | Body |
|---|---|---|---|---|
| POST | `/events/:id/laporan` | Yes | `admin`, `ketua` | `judul`, `konten`, `file_url?`, `tanggal?` |
| GET | `/events/:id/laporan` | Yes | `admin`, `ketua` | `page?`, `per_page?`, `q?`, `ketua_id?`, `tanggal_from?`, `tanggal_to?`, `sort_by?`, `order?` |

### 8. File Upload

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/upload` | Yes | multipart file upload |

Response upload mengembalikan objek `file` dengan metadata file, termasuk `bucket`, `object_path`, `filename`, `originalname`, `mimetype`, `size`, `url`, `gcs_uri`, dan `is_public`.

### 9. Realtime NoSQL Endpoints

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/realtime/checklist` | Auth |
| GET | `/realtime/events/:eventId/checklist` | `admin`, `ketua` |
| PATCH | `/realtime/checklist/:id/status` | Auth |
| POST | `/realtime/chat/messages` | Auth |
| GET | `/realtime/events/:eventId/chat` | Auth |
| POST | `/realtime/notifikasi` | `admin`, `ketua` |
| GET | `/realtime/notifikasi/me` | Auth |
| PATCH | `/realtime/notifikasi/:id/read` | Auth |
| POST | `/realtime/rundown-changes` | `admin`, `ketua` |
| GET | `/realtime/events/:eventId/rundown-changes` | `admin`, `ketua` |
| POST | `/realtime/logs` | Auth |
| GET | `/realtime/events/:eventId/logs` | `admin`, `ketua` |

### 10. Default Frontend Flow

1. Login via `/auth/login` dan simpan JWT token.
2. Kirim token di header `Authorization: Bearer <token>` untuk semua request protected.
3. Ambil profile user dari `/auth/me` untuk menentukan role frontend.
4. Load dashboard event via `/events` dan `/events/:id`.
5. Untuk detail event, panggil endpoint nested seperti `/events/:id/vendors`, `/events/:id/rundowns`, `/events/:id/tugas`, dan `/events/:id/laporan`.
6. Untuk update task status staf, gunakan `PATCH /tugas/:id/status` sesuai owner/admin policy.
7. Untuk upload file lampiran, gunakan `POST /upload` lalu simpan URL ke field `*_url` sesuai kebutuhan form.

### 11. Cara Test Endpoint

Contoh pakai `curl`:

Login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@eventsync.local\",\"password\":\"admin123\"}"
```

Ambil profile user:
```bash
curl http://localhost:8080/api/v1/auth/me ^
  -H "Authorization: Bearer <token>"
```

List event dengan filter, sort, dan pagination:
```bash
curl "http://localhost:8080/api/v1/events?page=1&per_page=10&status=aktif&sort_by=tanggal_mulai&order=asc" ^
  -H "Authorization: Bearer <token>"
```

List tugas dengan search:
```bash
curl "http://localhost:8080/api/v1/events/1/tugas?page=1&per_page=10&q=setup&status=proses&sort_by=deadline&order=asc" ^
  -H "Authorization: Bearer <token>"
```

Upload file:
```bash
curl -X POST http://localhost:8080/api/v1/upload ^
  -H "Authorization: Bearer <token>" ^
  -F "file=@C:\path\to\file.pdf"
```

Status update tugas milik sendiri:
```bash
curl -X PATCH http://localhost:8080/api/v1/tugas/1/status ^
  -H "Authorization: Bearer <token-staf>" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"selesai\",\"catatan\":\"Sudah diverifikasi\"}"
```

Kalau kamu mau cek satu per satu secara manual, pakai juga [TEST_ENDPOINT_CHECKLIST.md](TEST_ENDPOINT_CHECKLIST.md) sebagai checklist.

## Default Demo Users

| Email | Password | Role |
|-------|----------|------|
| admin@eventsync.local | admin123 | admin |
| ketua@eventsync.local | ketua123 | ketua |
| staf@eventsync.local | staf123 | staf |

## Project Structure

```
src/
  ├── server.js              # Entry point
  ├── app.js                 # Express app setup
  ├── config/                # Configuration
  │   ├── sql.js            # Sequelize config
  │   └── mongo.js          # MongoDB config
  ├── models/
  │   ├── sql/              # Sequelize models
  │   └── nosql/            # Mongoose schemas
  ├── controllers/           # Business logic
  ├── routes/               # API routes
  ├── middleware/           # Authentication, authorization, error handling
  └── utils/                # Helper functions
migrations/                 # Database migrations
seeders/                    # Demo data seeders
```

## Tech Stack
- **Framework**: Express.js
- **SQL ORM**: Sequelize
- **NoSQL**: MongoDB/Mongoose
- **Authentication**: JWT
- **Password**: bcrypt
- **File Upload**: Multer (+ Google Cloud Storage)
- **Validation**: Custom (Joi/Zod recommended)
- **Middleware**: helmet, cors, morgan

## Notes
- Token yang sudah di-logout di-store di MongoDB TokenBlacklist
- Role-based access control (admin > ketua > staf)
- Semua response mengikuti standardized format
- Password di-hash dengan bcrypt, tidak pernah di-return dalam response
- Mode Mongo dikontrol oleh `MONGO_MODE`:
  - `full`: default, Mongo wajib tersedia untuk fitur realtime dan auth blacklist
  - `sql-only`: mode fallback opsional kalau ingin menonaktifkan fitur NoSQL sementara

## Troubleshooting
- **Koneksi database gagal**: Pastikan MySQL/MongoDB sudah running
- **JWT error**: Cek JWT_SECRET di .env
- **CORS error**: Tambah frontend URL ke ALLOWED_ORIGINS di .env
