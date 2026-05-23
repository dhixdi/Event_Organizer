# EventSync

Platform koordinasi panitia & vendor acara secara realtime.

---

## Prasyarat

Pastikan sudah terinstall di laptop:

| Tool | Versi | Keterangan |
|---|---|---|
| Node.js | v20+ | https://nodejs.org |
| XAMPP | Terbaru | MySQL harus **Start** |
| MongoDB | Terbaru | https://mongodb.com/try/download/community |
| Git | Terbaru | https://git-scm.com |

---

## Cara Menjalankan di Lokal

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Buat Database

Buka **XAMPP Control Panel** → Start **MySQL**.

Buka browser → `http://localhost/phpmyadmin` → buat database baru:

```
Nama database : eventsync_db
Collation     : utf8mb4_unicode_ci
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/` (lihat `backend/.env.example`):

```env
NODE_ENV=development
PORT=8080
APP_URL=http://localhost:8080

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=eventsync_db
DB_USER=root
DB_PASSWORD=
DB_DIALECT=mysql
DATABASE_URL=

MONGO_MODE=sql-only
MONGO_URI=mongodb://127.0.0.1:27017/eventsync

JWT_SECRET=eventsync_super_secret_key_2026_ganti_ini
JWT_EXPIRES_IN=24h

GCS_BUCKET_NAME=
GCS_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=
GCS_UPLOAD_FOLDER=uploads
GCS_MAKE_PUBLIC=false

ALLOWED_ORIGINS=http://localhost:5173
```

> `DB_PASSWORD` dikosongkan jika XAMPP root tidak pakai password.
> Ganti `MONGO_MODE=full` jika MongoDB sudah terinstall dan ingin mengaktifkan fitur realtime.

Jalankan migration dan seeder:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Jalankan backend:

```bash
npm run dev
```

Backend berjalan di → `http://localhost:8080`

Verifikasi:
```
GET http://localhost:8080/health
→ { "success": true, "message": "OK" }
```

### 4. Setup Frontend

Buka terminal baru (jangan tutup terminal backend):

```bash
cd frontend
npm install
```

Buat file `.env` di dalam folder `frontend/`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di → `http://localhost:5173`

---

## Akun Demo

| Email | Password | Role |
|---|---|---|
| admin@eventsync.local | admin123 | admin |
| ketua@eventsync.local | ketua123 | ketua |
| staf@eventsync.local | staf123 | staf |

---

## Struktur Project

```
eventsync/
├── backend/      → Express.js API (port 8080)
├── frontend/     → React.js Web App (port 5173)
└── README.md     → file ini
```

---

## Troubleshooting

**Backend gagal konek ke MySQL**
- Pastikan MySQL XAMPP sudah Start
- Cek port di XAMPP → Config → `my.ini`, cari `port=` (biasanya 3306 atau 3307)
- Sesuaikan `DB_PORT` di `.env`

**Migration error**
- Pastikan database `eventsync_db` sudah dibuat di phpMyAdmin
- Pastikan `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` di `.env` benar

**Frontend tidak bisa login**
- Pastikan backend sudah jalan di port 8080
- Pastikan `VITE_API_URL` di `frontend/.env` benar
- Cek CORS: `ALLOWED_ORIGINS` di `backend/.env` harus include `http://localhost:5173`

**Fitur chat/notifikasi tidak aktif**
- Normal jika `MONGO_MODE=sql-only`
- Install MongoDB dan ganti ke `MONGO_MODE=full` untuk mengaktifkan fitur realtime
