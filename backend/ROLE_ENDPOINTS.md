# Role Endpoints Reference

Dokumen ini merangkum endpoint berdasarkan role dan contoh body request yang paling sering dipakai frontend.

## Base URL

```text
http://localhost:8080/api/v1
```

## Roles

- `admin` - akses paling penuh
- `ketua` - operator utama event
- `staf` - akses terbatas untuk data yang diberikan

## JWT Header

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Access Matrix

### Auth

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Auth |
| POST | `/auth/logout` | Auth |

### User

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/users` | `admin`, `ketua` |
| GET | `/users/:id` | Auth |
| PUT | `/users/:id` | `admin`, `ketua` |
| PATCH | `/users/:id/role` | `admin` |
| DELETE | `/users/:id` | `admin` |

### Event

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/events` | `admin`, `ketua` |
| GET | `/events` | Auth |
| GET | `/events/:id` | Auth |
| PUT | `/events/:id` | `admin`, `ketua` |
| DELETE | `/events/:id` | `admin` |

### Vendor

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/events/:id/vendors` | `admin`, `ketua` |
| GET | `/events/:id/vendors` | Auth |
| GET | `/vendors/:id` | Auth |
| PUT | `/vendors/:id` | `admin`, `ketua` |
| DELETE | `/vendors/:id` | `admin`, `ketua` |

### Rundown

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/events/:id/rundowns` | `admin`, `ketua` |
| GET | `/events/:id/rundowns` | Auth |
| PUT | `/rundowns/:id` | `admin`, `ketua` |
| DELETE | `/rundowns/:id` | `admin`, `ketua` |

### Tugas

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/events/:id/tugas` | `admin`, `ketua` |
| GET | `/events/:id/tugas` | Auth |
| GET | `/tugas/:id` | Auth |
| PUT | `/tugas/:id` | Auth |
| PATCH | `/tugas/:id/status` | Owner / `admin` |
| DELETE | `/tugas/:id` | `admin`, `ketua` |

### Laporan

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/events/:id/laporan` | `admin`, `ketua` |
| GET | `/events/:id/laporan` | `admin`, `ketua` |

### Realtime / NoSQL

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

### Upload

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/upload` | Auth |

## Example Request Bodies

### 1. Register

```json
{
  "name": "Admin User",
  "email": "admin@eventsync.local",
  "password": "admin123",
  "role": "staf",
  "divisi": "Admin",
  "phone": "08123456789"
}
```

Catatan:
- Endpoint `POST /auth/register` saat ini hanya menerima registrasi publik untuk role `staf`.
- Akun `admin` dan `ketua` sebaiknya dibuat lewat seeder, insert database, atau proses onboarding internal.

### 2. Login

```json
{
  "email": "admin@eventsync.local",
  "password": "admin123"
}
```

### 3. Create Event

```json
{
  "nama_event": "Workshop Tech Innovation 2026",
  "deskripsi": "Workshop tentang inovasi teknologi terkini",
  "lokasi": "Gedung Serbaguna - Lantai 2",
  "tanggal_mulai": "2026-05-20",
  "tanggal_selesai": "2026-05-22",
  "status": "aktif",
  "ketua_id": 2
}
```

### 4. Update Event

```json
{
  "nama_event": "Workshop Tech Innovation 2026 - Revisi",
  "lokasi": "Gedung Serbaguna - Lantai 3",
  "status": "aktif"
}
```

### 5. Create Vendor

```json
{
  "nama_vendor": "Catering Mitra Jaya",
  "kategori": "Catering",
  "kontak_person": "Pak Budiman",
  "telepon": "081200001111",
  "email": "catering@mitrajaya.com",
  "alamat": "Jl. Raya Depok No. 45, Jakarta",
  "kontrak_url": "/uploads/kontrak.pdf",
  "status": "aktif",
  "catatan": "Vendor utama untuk makanan"
}
```

### 6. Create Rundown

```json
{
  "urutan": 1,
  "waktu_mulai": "08:00:00",
  "waktu_selesai": "08:30:00",
  "judul_sesi": "Registrasi & Pembukaan",
  "deskripsi": "Peserta registrasi dan pembukaan acara",
  "pic_id": 2,
  "vendor_id": 1,
  "status": "belum"
}
```

### 7. Create Tugas

```json
{
  "judul": "Persiapan tempat dan setup meja",
  "deskripsi": "Setup ruangan untuk registrasi peserta",
  "assignee_id": 3,
  "divisi": "Divisi Dekorasi",
  "prioritas": "tinggi",
  "status": "belum",
  "deadline": "2026-05-20 08:00:00",
  "lampiran_url": "/uploads/brief.pdf",
  "catatan": "Pastikan selesai sebelum jam 8",
  "rundown_id": 1
}
```

### 8. Update Task Status

```json
{
  "status": "selesai",
  "catatan": "Sudah dikerjakan dan diverifikasi"
}
```

### 9. Create Laporan

```json
{
  "judul": "Laporan Pelaksanaan Acara Hari 1",
  "konten": "Acara berjalan lancar dengan catatan minor pada bagian registrasi.",
  "file_url": "/uploads/laporan-hari-1.pdf",
  "tanggal": "2026-05-15"
}
```

### 10. Update User

```json
{
  "name": "Ketua Panitia Revisi",
  "phone": "081200000222",
  "divisi": "Panitia Inti",
  "avatar_url": "/uploads/avatar.jpg",
  "is_active": true
}
```

### 11. Update Role User

```json
{
  "role": "ketua"
}
```

### 12. Upload File

Request upload memakai `multipart/form-data`, bukan JSON.

Field contoh:

```text
file: <binary file>
```

## Catatan Penting untuk Frontend

- Endpoint yang butuh token wajib kirim `Authorization: Bearer <token>`.
- Endpoint nested di bawah `/events/:id/...` dipakai untuk data yang terikat ke satu event.
- Untuk update status tugas, frontend cukup kirim `status` dan optional `catatan`.
- Upload file dipakai untuk mengisi field seperti `avatar_url`, `kontrak_url`, `lampiran_url`, dan `file_url`.
- Berdasarkan implementasi saat ini, beberapa endpoint read/update/delete masih auth-only di backend, jadi frontend tetap harus mengirim token walaupun tidak selalu ada pembatasan role tambahan.
- Kalau role user diubah di database, token JWT lama masih membawa role lama sampai user login ulang atau token baru diterbitkan.
- Sisi client sebaiknya ambil ulang data user dari `GET /auth/me` setelah login, dan lakukan logout/login ulang jika ada perubahan role atau status akun.
- `PUT /users/:id` hanya bisa diakses oleh user sendiri atau admin (owner-only).
- `PUT /users/:id` saat ini dibuka untuk `admin` dan `ketua`.
- `PATCH /tugas/:id/status` hanya bisa diakses oleh user yang di-assign tugas atau admin.
- Untuk query list, backend mendukung `page`, `per_page`, `q`, `sort_by`, `order`, dan filter spesifik per resource.
