const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

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
    res.send('File uploaded successfully!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});