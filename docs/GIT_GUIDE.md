# 🐙 Panduan Praktis Git Workflow untuk Fullstack Developer

Panduan praktis perintah Git harian yang digunakan oleh para engineer profesional.

---

## ⚡ Perintah Penting Harian

### 1. Memeriksa Status & Perubahan
```bash
# Cek file mana yang baru diubah
git status

# Lihat perbedaan baris kode sebelum di-commit
git diff
```

### 2. Menyimpan Perubahan (Staging & Commit)
```bash
# Tambahkan semua perubahan ke area staging
git add .

# Buat commit dengan pesan semantik
git commit -m "feat(ui): tambahkan tab live api tester"
```

### 3. Bekerja dengan Branch (Fitur Baru)
```bash
# Buat branch baru untuk fitur dan langsung pindah ke branch tersebut
git checkout -b feat/nama-fitur

# Pindah kembali ke branch utama
git checkout main

# Menggabungkan branch fitur ke main
git merge feat/nama-fitur
```

### 4. Sinkronisasi dengan GitHub
```bash
# Mengunggah perubahan ke repositori remote di GitHub
git push origin main

# Mengambil perubahan terbaru dari GitHub
git pull origin main
```

---

## 🏷️ Konvensi Pesan Commit (Conventional Commits)

| Tipe | Kapan Digunakan | Contoh |
| :--- | :--- | :--- |
| `feat` | Menambahkan fitur baru | `feat: tambah endpoint /api/notes` |
| `fix` | Memperbaiki bug | `fix: atasi CORS header pada response` |
| `docs` | Perubahan dokumentasi | `docs: perbarui panduan instalasi di README` |
| `style` | Formatting tanpa ubah logika | `style: rapikan indentasi CSS` |
| `refactor` | Refactor kode tanpa ubah fitur | `refactor: pisahkan fungsi router ke modul` |
| `chore` | Update konfigurasi / dependensi | `chore: update .gitignore` |
