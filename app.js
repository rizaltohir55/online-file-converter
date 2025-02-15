// Import modul yang diperlukan
const express = require('express');
const path = require('path');
const multer = require('multer'); // Middleware untuk upload file

// Inisialisasi aplikasi Express
const app = express();

// Set port aplikasi
const PORT = process.env.PORT || 3000;

// Konfigurasi Multer untuk menyimpan file di folder 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Lokasi penyimpanan file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nama file unik
    }
});

const upload = multer({ storage: storage });

// Middleware untuk menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route untuk menangani upload file
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Tidak ada file yang diunggah.');
    }

    res.send(`File berhasil diunggah: ${req.file.filename}`);
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});