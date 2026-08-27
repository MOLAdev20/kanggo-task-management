# Instalasi dan Menjalankan Aplikasi

Dokumen ini menjelaskan dua cara menjalankan Kanggo Task Management:

1. menggunakan Docker Compose (cara paling cepat), atau
2. memasang database dan dependency secara manual.

## Prasyarat

- Git
- Node.js 22 atau lebih baru (instalasi manual)
- Docker Desktop dan Docker Compose v2 (cara Docker)
- MariaDB/MySQL 8+ (instalasi manual)

Semua perintah di bawah dijalankan dari root repository:

```bash
cd kanggo-task-management
```

## Cara 1: Docker Compose

Pastikan Docker Desktop sudah aktif, lalu jalankan:

```bash
docker compose up --build
```

Compose akan menjalankan MariaDB, API backend, dan Vite frontend. Backend menunggu database sehat kemudian menjalankan migrasi Prisma secara otomatis.

Buka aplikasi di <http://localhost:5173>. API tersedia di <http://localhost:8080>.

Untuk menjalankan di background:

```bash
docker compose up --build -d
docker compose logs -f
```

Untuk menghentikan container:

```bash
docker compose down
```

Data MariaDB disimpan di volume `mariadb_data`, sehingga `docker compose down` tidak menghapusnya. Untuk menghapus container sekaligus seluruh data database (destruktif), jalankan `docker compose down -v`.

## Cara 2: Instalasi Manual

### 1. Siapkan database

Buat database dan user MariaDB, misalnya:

```sql
CREATE DATABASE kanggo_task_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kanggo'@'localhost' IDENTIFIED BY 'kanggo_password';
GRANT ALL PRIVILEGES ON kanggo_task_management.* TO 'kanggo'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Konfigurasi backend

Salin `backend/env.example` menjadi `backend/.env` (atau edit `.env` yang sudah ada), lalu sesuaikan nilainya:

```dotenv
PORT=8080
CORS_ORIGIN=http://localhost:5173
JWT_SECRET_KEY=ganti-dengan-secret-yang-kuat
JWT_EXPIRED_DURATION=1d
DATABASE_URL=mysql://kanggo:kanggo_password@localhost:3306/kanggo_task_management
DATABASE_USER=kanggo
DATABASE_PASSWORD=kanggo_password
DATABASE_NAME=kanggo_task_management
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

`DATABASE_URL` dipakai Prisma, sedangkan variabel `DATABASE_*` dipakai adapter MariaDB aplikasi.

### 3. Install dan siapkan backend

```bash
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Biarkan proses backend tetap berjalan. Buka terminal kedua untuk frontend.

### 4. Konfigurasi dan jalankan frontend

Pastikan `frontend/.env` berisi URL API yang dapat diakses browser:

```dotenv
VITE_BASE_URL=http://localhost:5173
VITE_API_URL=http://localhost:8080
```

Kemudian jalankan:

```bash
cd frontend
npm ci
npm run dev -- --host 0.0.0.0
```

Buka <http://localhost:5173>.

## Troubleshooting

- **Port sudah dipakai:** hentikan proses yang memakai port `3306`, `8080`, atau `5173`, atau ubah mapping port di `docker-compose.yml` dan nilai environment terkait.
- **Backend gagal terhubung ke database:** pastikan MariaDB aktif dan nilai `DATABASE_HOST`, user, password, nama database, serta port benar. Pada Docker, host database adalah `db`, bukan `localhost`.
- **Perubahan schema belum masuk:** jalankan `npx prisma migrate deploy` dari folder `backend`.
- **Frontend memanggil URL yang salah:** `VITE_API_URL` harus menunjuk ke URL yang bisa dijangkau browser, biasanya `http://localhost:8080`.
