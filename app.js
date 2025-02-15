// Import modul yang diperlukan
const express = require('express');
const path = require('path');
const multer = require('multer'); // Middleware untuk upload file
const fs = require('fs'); // Modul untuk membaca/menulis file
const { promisify } = require('util'); // Untuk menggunakan versi async dari fs
const sharp = require('sharp'); // Library untuk manipulasi gambar

// Inisialisasi aplikasi Express
const app = express();

// Set port aplikasi
const PORT = process.env.PORT || 3000;

// Install sharp untuk manipulasi gambar
// Jalankan perintah berikut di terminal:
// npm install sharp

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

// Route untuk menangani upload file dan konversi gambar
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Tidak ada file yang diunggah.');
    }

    const conversionType = req.body.conversionType; // Jenis konversi yang dipilih
    const filePath = req.file.path; // Path file yang diunggah
    const fileName = req.file.filename; // Nama file yang diunggah
    const fileExt = path.extname(fileName).toLowerCase(); // Ekstensi file

    try {
        if (conversionType === 'image') {
            // Konversi gambar ke format lain (misalnya JPG ke PNG)
            const outputFormat = 'png'; // Format output (bisa diubah sesuai kebutuhan)
            const outputPath = path.join(__dirname, 'uploads', `${Date.now()}-converted.${outputFormat}`);

            // Gunakan sharp untuk mengonversi gambar
            await sharp(filePath)
                .toFormat(outputFormat)
                .toFile(outputPath);

            // Hapus file asli setelah dikonversi
            fs.unlinkSync(filePath);

            res.send(`File berhasil dikonversi ke ${outputFormat}: <a href="/${outputPath}">${outputPath}</a>`);
        } else {
            res.send('Jenis konversi lain belum diimplementasikan.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengonversi file.');
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});