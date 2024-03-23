const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const fs = require('fs-extra');
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

cron.schedule('* * * * *', async () => {
    try {
        const uploadDir = './uploads'; // Directory where uploaded files are stored

        // Get a list of all files in the upload directory
        const files = await fs.readdir(uploadDir);

        // Filter files older than 24 hours
        const currentTime = new Date().getTime();
        const filesToDelete = files.filter((file) => {
            const filePath = `${uploadDir}/${file}`;
            const fileStats = fs.statSync(filePath);
            const fileModifiedTime = fileStats.mtime.getTime();
            return currentTime - fileModifiedTime > 60 * 1000; // 24 hours in milliseconds
        });

        // Delete files older than 24 hours
        filesToDelete.forEach(async (file) => {
            const filePath = `${uploadDir}/${file}`;
            await fs.unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
        });
    } catch (error) {
        console.error('Error deleting files:', error);
    }
});


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
    const filePath = path.join(__dirname, 'uploads', `${filename}.zip`);

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