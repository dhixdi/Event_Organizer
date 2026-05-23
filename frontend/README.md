# EventSync Frontend

Frontend web untuk platform koordinasi panitia & vendor acara.

## Tech Stack
- React.js + Vite
- Tailwind CSS
- Axios + React Router DOM

## Setup

### 1. Clone repo
git clone https://github.com/USERNAME/eventsync-frontend.git
cd eventsync-frontend

### 2. Install dependencies
npm install

### 3. Konfigurasi environment
Buat file `.env` di root project:
VITE_API_URL=https://backend-url/api/v1

Ganti `https://backend-url` dengan URL backend yang sedang berjalan.

### 4. Jalankan
npm run dev

Buka http://localhost:5173

## Demo Accounts
| Email | Password | Role |
|---|---|---|
| admin@eventsync.local | admin123 | admin |
| ketua@eventsync.local | ketua123 | ketua |
| staf@eventsync.local | staf123 | staf |

## Fitur
- Dashboard ringkasan event
- Manajemen event (CRUD)
- Alokasi & monitoring tugas
- Rundown timeline acara
- Manajemen vendor
- Laporan ketua
