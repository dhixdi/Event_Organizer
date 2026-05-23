# Technical Debt - EventSync Backend

Dokumen ini mencatat pekerjaan teknis yang belum selesai, kompromi implementasi, dan area yang perlu dirapikan sebelum production.

## 1. Auth & Role Management

### Debt
- `POST /auth/register` hanya bisa membuat role `staf`.
- Role di JWT tidak berubah sampai user login ulang.

### Dampak
- Onboarding admin/ketua masih manual lewat seeder atau database insert.
- Perubahan role di server tidak langsung tercermin di client jika token lama masih aktif.

### Prioritas
- Tinggi

### Rekomendasi
- Paksa refresh session/token setelah role berubah.

## 2. Request Validation

### Debt
- Validasi request belum terpusat dengan Joi/Zod.
- Validasi masih tersebar dan belum mencakup semua field enum, tanggal, dan format file.

### Dampak
- Risiko data tidak konsisten masuk ke database.
- Error handling bisa berbeda antar controller.

### Prioritas
- Tinggi

### Rekomendasi
- Tambahkan schema validation untuk auth, event, vendor, rundown, tugas, dan laporan.
- Gunakan middleware validasi per route.

## 3. MongoDB Availability

### Debt
- MongoDB connection sekarang dibuat optional agar backend SQL tetap bisa jalan.
- Kalau fitur NoSQL dipakai penuh, MongoDB tetap harus tersedia.

### Dampak
- Backend bisa start tanpa MongoDB, tetapi fitur token blacklist, chat, notifikasi, dan log realtime tidak aktif penuh.

### Prioritas
- Sedang

### Rekomendasi
- Tambahkan mode startup yang lebih eksplisit: SQL-only dev mode vs full stack mode.
- Tampilkan warning yang jelas saat MongoDB tidak tersedia.

## 4. Upload Storage

### Debt
- Integrasi Google Cloud Storage masih berupa stub/basic endpoint.
- Belum ada upload pipeline lengkap untuk path spesifik per resource.

### Dampak
- File upload belum production-ready.
- Tidak ada enforce ukuran file dan tipe file secara menyeluruh.

### Prioritas
- Tinggi

### Rekomendasi
- Implementasi `storageService.js` penuh.
- Validasi MIME type, ekstensi, dan batas ukuran 10 MB.

## 5. Owner-Level Authorization

### Status: SELESAI ✓

### Implementasi
- `ownerMiddleware` sudah diimplementasikan di `src/middleware/ownerMiddleware.js`.
- Diterapkan pada `PUT /users/:id` untuk user profile update (user sendiri atau admin).
- Diterapkan pada `PATCH /tugas/:id/status` untuk status update (assignee user atau admin).
- Admin otomatis bypass ownership check.

## 6. Error Handling

### Debt
- Global error handler masih generik.
- Belum ada custom error class yang memisahkan validation, auth, not found, dan conflict.

### Dampak
- Client menerima error yang kurang spesifik.
- Debugging lebih sulit saat failure di production.

### Prioritas
- Sedang

### Rekomendasi
- Tambahkan `ValidationError`, `AuthError`, `NotFoundError`, dan `ConflictError`.
- Standarkan format error response di semua layer.

## 7. Pagination and Filtering

### Debt
- Endpoint list masih belum punya pagination, sorting, dan filtering konsisten.

### Dampak
- Dataset besar akan berat di frontend dan backend.

### Prioritas
- Sedang

### Rekomendasi
- Tambahkan query `page`, `per_page`, `sort`, dan filter per resource.

## 8. API Documentation

### Debt
- Dokumentasi endpoint masih berupa markdown manual.
- Belum ada Swagger/OpenAPI yang bisa langsung dipakai frontend atau QA.

### Dampak
- Integrasi frontend bergantung pada file dokumentasi manual.

### Prioritas
- Rendah ke sedang

### Rekomendasi
- Tambahkan Swagger UI atau OpenAPI spec.

## 9. Test Coverage

### Debt
- Belum ada unit test dan integration test yang memadai.
- Endpoint penting belum diverifikasi otomatis.

### Dampak
- Perubahan kode berisiko merusak behavior tanpa terdeteksi cepat.

### Prioritas
- Tinggi

### Rekomendasi
- Tambahkan test untuk auth, role guard, dan CRUD utama.

## 10. Seeder and Sample Data

### Debt
- Seeder ada, tetapi masih data dummy dasar.
- Belum ada skenario sample data untuk semua relasi dan edge case.

### Dampak
- Testing frontend dan demo fitur kompleks masih terbatas.

### Prioritas
- Rendah

### Rekomendasi
- Tambahkan seeder lanjutan untuk event, vendor, rundown, tugas, laporan, dan data edge case.

## Summary

### Harus dikerjakan sebelum production
- Admin-only role management
- Request validation
- GCS upload penuh
- Test coverage dasar

### Bisa menyusul setelah itu
- Owner middleware
- Pagination/filtering
- Swagger/OpenAPI
- Seeder lanjutan
