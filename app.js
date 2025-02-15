// Import modul yang diperlukan
const express = require('express');
const path = require('path');

// Inisialisasi aplikasi Express
const app = express();

// Set port aplikasi
const PORT = process.env.PORT || 3000;

// Middleware untuk menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.send('<h1>Selamat datang di Online File Converter!</h1>');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});