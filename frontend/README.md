# EventSync Frontend

Frontend web untuk platform koordinasi panitia & vendor acara — **EventSync**.

---

## Tech Stack

| Teknologi | Versi | Keterangan |
|---|---|---|
| React.js | 18+ | UI Library |
| Vite | 5+ | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| Axios | Latest | HTTP client ke backend API |
| React Router DOM | 6 | Client-side routing |

---

## Fitur

- 🔐 Autentikasi JWT (login, logout, session persistent)
- 🛡️ Role-based access (admin / ketua / staf)
- 📅 Manajemen event (CRUD, filter, pagination)
- 📋 Detail event dengan tab: Ringkasan, Rundown, Vendor, Tugas, Laporan
- ✅ Update status tugas langsung dari UI
- 👥 Manajemen user dengan update role (khusus admin/ketua)
- 🔍 Search & filter realtime di semua halaman list

---

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Buat file `.env`

Buat file `.env` di root folder `frontend/`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

> Ganti URL sesuai alamat backend yang berjalan.

### 3. Jalankan

```bash
npm run dev
```

Buka `http://localhost:5173`

---

## Akun Demo

| Email | Password | Role | Akses |
|---|---|---|---|
| admin@eventsync.local | admin123 | admin | Penuh — termasuk hapus user & ubah role |
| ketua@eventsync.local | ketua123 | ketua | CRUD event, vendor, rundown, tugas, laporan |
| staf@eventsync.local | staf123 | staf | Lihat event & rundown, update status tugas sendiri |

---

## Struktur Folder

```
frontend/src/
├── context/
│   └── AuthContext.jsx         ← State global user login + fungsi login/logout
├── services/
│   ├── api.js                  ← Axios instance dengan interceptor token & 401
│   ├── authService.js          ← login, logout, me
│   ├── eventService.js         ← CRUD event + nested vendors/rundowns/tugas/laporan
│   ├── userService.js          ← CRUD user + update role
│   ├── tugasService.js         ← update tugas & status
│   ├── vendorService.js        ← update & delete vendor
│   └── rundownService.js       ← update & delete rundown
├── components/
│   ├── PrivateRoute.jsx        ← Guard route berdasarkan auth & role
│   ├── Sidebar.jsx             ← Navigasi sidebar dengan info user
│   ├── layout/
│   │   └── AppLayout.jsx       ← Layout utama: sidebar + main content
│   └── ui/
│       ├── Badge.jsx           ← Label status & role berwarna
│       ├── Card.jsx            ← Container card dengan efek glass
│       ├── Spinner.jsx         ← Loading indicator
│       ├── Pagination.jsx      ← Navigasi halaman dengan info total data
│       └── EmptyState.jsx      ← Tampilan saat data kosong
├── hooks/
│   ├── useAuth.js              ← Re-export useAuth dari AuthContext
│   └── usePagination.js        ← Helper state pagination (page, perPage)
├── pages/
│   ├── Login.jsx               ← Form login dengan demo accounts hint
│   ├── Dashboard.jsx           ← Statistik event & daftar event terbaru
│   ├── Events.jsx              ← List event dengan search, filter, create
│   ├── EventDetail.jsx         ← Detail event dengan 5 tab konten
│   ├── Users.jsx               ← Manajemen user (admin/ketua only)
│   └── NotFound.jsx            ← Halaman 404
├── utils/
│   └── formatters.js           ← formatDate, formatDateTime, STATUS_COLORS, ROLE_COLORS
├── App.jsx                     ← Router utama + route protection
└── main.jsx                    ← Entry point React
```

---

## Color Palette

Warna brand EventSync yang dipakai di seluruh UI:

| Nama | Hex | Dipakai untuk |
|---|---|---|
| Primary | `#7C3AED` | Tombol utama, aksen aktif, highlight |
| Secondary | `#A855F7` | Aksen sekunder, badge role ketua |
| Accent | `#22D3EE` | Badge role staf, highlight realtime |
| Background | `#0F172A` | Background halaman utama |
| Surface | `#1E293B` | Card, input, sidebar |
| Text | `#F8FAFC` | Teks utama |
| Muted Text | `#94A3B8` | Label, placeholder, teks sekunder |

Semua warna sudah dikonfigurasi di `tailwind.config.js` dan bisa dipakai langsung sebagai class Tailwind:

```jsx
// Contoh pemakaian
<div className="bg-background text-text-base">
  <span className="text-primary">EventSync</span>
  <p className="text-muted">Subtitle</p>
</div>
```

---

## Utility Classes Kustom

Dua class tambahan tersedia di `src/index.css`:

```css
.glass   → bg-white/5 backdrop-blur border border-white/10 (efek frosted glass)
.glow    → box-shadow dengan warna primary (efek cahaya ungu)
```

Contoh:
```jsx
<div className="glass rounded-xl p-6">...</div>
<button className="bg-primary glow">Simpan</button>
```

---

## Tipografi

Font yang dipakai (di-load dari Google Fonts):

| Nama | Dipakai untuk | Class Tailwind |
|---|---|---|
| Space Grotesk | Judul, heading, angka besar | `font-display` |
| DM Sans | Body text, paragraf, label | `font-body` |
| JetBrains Mono | Kode, token, ID | `font-mono` |

---

## Flow Autentikasi

```
User buka halaman
    ↓
AuthContext cek localStorage (token + user)
    ↓
Ada token → validasi ke GET /auth/me
    ↓
Valid → render halaman | Invalid → redirect /login
    ↓
Login berhasil → token disimpan di localStorage
    ↓
Setiap request Axios otomatis sisipkan Authorization: Bearer <token>
    ↓
Jika response 401 → localStorage dibersihkan → redirect /login
```

---

## Role & Akses Halaman

| Halaman | admin | ketua | staf |
|---|---|---|---|
| `/dashboard` | ✅ | ✅ | ✅ |
| `/events` | ✅ | ✅ | ✅ (read only) |
| `/events/:id` | ✅ | ✅ | ✅ (read only) |
| `/users` | ✅ | ✅ | ❌ redirect |
| Update status tugas | ✅ | ✅ | ✅ (milik sendiri) |
| Hapus user | ✅ | ❌ | ❌ |
| Ubah role user | ✅ | ❌ | ❌ |

---

## Environment Variables

| Variable | Contoh | Keterangan |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api/v1` | Base URL backend API |

Untuk production (setelah deploy ke cloud):
```env
VITE_API_URL=https://backend-url-production.com/api/v1
```
