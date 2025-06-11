# Deployment ke Railway

Panduan lengkap untuk deploy backend ini ke Railway.

## Prasyarat

1. Akun Railway (daftar di [railway.app](https://railway.app))
2. Repository Git (GitHub, GitLab, atau Bitbucket)
3. Railway CLI (opsional, untuk deployment lokal)

## Langkah-langkah Deployment

### 1. Persiapan Repository

Pastikan semua file sudah di-commit ke repository Git Anda:

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Setup Project di Railway

1. Login ke [Railway Dashboard](https://railway.app/dashboard)
2. Klik "New Project"
3. Pilih "Deploy from GitHub repo"
4. Pilih repository backend Anda
5. Railway akan otomatis mendeteksi sebagai Node.js project

### 3. Setup Database

1. Di Railway dashboard, klik "Add Service"
2. Pilih "Database" → "MySQL"
3. Railway akan membuat MySQL instance dan memberikan connection string
4. Copy `DATABASE_URL` dari tab "Variables" di MySQL service

### 4. Konfigurasi Environment Variables

Di Railway dashboard, buka service backend Anda dan tambahkan variables berikut:

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

**Penting:** 
- `DATABASE_URL` akan otomatis tersedia dari MySQL service
- Ganti `JWT_SECRET` dengan string random yang aman
- `PORT` tidak perlu diset, Railway akan set otomatis

### 5. Deploy

1. Railway akan otomatis deploy setelah setup selesai
2. Proses build akan menjalankan:
   - `npm install`
   - `prisma generate && prisma migrate deploy` (dari postinstall script)
   - `npm start`

### 6. Verifikasi Deployment

Setelah deployment selesai:

1. Buka URL yang diberikan Railway
2. Test health check: `https://your-app.railway.app/api/test/health`
3. Harus return: `{"status":"OK","message":"Server is running","timestamp":"..."}`

## Troubleshooting

### Database Connection Issues

Jika ada error koneksi database:

1. Pastikan `DATABASE_URL` sudah benar di environment variables
2. Cek apakah MySQL service sudah running
3. Pastikan Prisma migrations berhasil dijalankan

### Build Failures

Jika build gagal:

1. Cek logs di Railway dashboard
2. Pastikan semua dependencies ada di `package.json`
3. Pastikan `postinstall` script berjalan dengan benar

### Runtime Errors

Jika aplikasi crash saat running:

1. Cek application logs di Railway dashboard
2. Pastikan semua environment variables sudah diset
3. Test endpoint health check

## Monitoring

Railway menyediakan:

- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Health Checks**: Otomatis monitoring endpoint `/api/test/health`

## Custom Domain (Opsional)

Untuk menggunakan domain sendiri:

1. Di Railway dashboard, buka tab "Settings"
2. Scroll ke "Domains"
3. Klik "Add Domain"
4. Ikuti instruksi untuk setup DNS

## Railway CLI (Opsional)

Install Railway CLI untuk deployment dari terminal:

```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

## File Konfigurasi

Project ini sudah include:

- `railway.toml`: Konfigurasi Railway
- `.env.example`: Template environment variables
- Health check endpoint di `/api/test/health`
- Production-ready scripts di `package.json`

## Support

Jika ada masalah:

1. Cek [Railway Documentation](https://docs.railway.app)
2. Join [Railway Discord](https://discord.gg/railway)
3. Buka issue di repository ini
