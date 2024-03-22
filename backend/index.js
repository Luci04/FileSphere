const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

require('dotenv').config()

const PORT = process.env.PORT;

app.use(cors());

app.use(express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // uploads directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // use the original filename
    },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFilePath = path.join(__dirname, 'uploads', req.file.filename);

    const downloadLink = `http://localhost:5000/${req.file.filename}`;

    res.json({ downloadLink }); // Send the download link back to the frontend
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    try {
        if (fs.existsSync(filePath)) {
            res.download(filePath); // Send the file for download
        } else {
            res.status(404).send('File not found');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});