const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const PASSWORD = process.env.PASSWORD || '';

// Ensure upload directory exists
if (!fsSync.existsSync(UPLOAD_DIR)) {
    fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory: ${UPLOAD_DIR}`);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 * 5 } // 5GB limit
});

// Authentication middleware
const authenticate = (req, res, next) => {
    if (!PASSWORD) return next();

    const auth = req.headers.authorization;
    if (auth === PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Serve static frontend
app.use(express.static('public'));

// API endpoints
app.post('/api/upload', authenticate, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log(`File uploaded: ${req.file.filename} (${req.file.size} bytes)`);
    res.json({
        success: true,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
    });
});

app.get('/api/files', authenticate, async (req, res) => {
    try {
        const files = await fs.readdir(UPLOAD_DIR);
        const fileStats = await Promise.all(
            files.map(async (name) => {
                const stats = await fs.stat(path.join(UPLOAD_DIR, name));
                return { name, size: stats.size };
            })
        );
        res.json({ files: fileStats });
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Failed to read files' });
    }
});

app.get('/api/files/:filename', authenticate, (req, res) => {
    const filepath = path.join(UPLOAD_DIR, req.params.filename);

    if (!fsSync.existsSync(filepath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    console.log(`File downloaded: ${req.params.filename}`);
    res.download(filepath);
});

app.delete('/api/files/:filename', authenticate, async (req, res) => {
    try {
        const filepath = path.join(UPLOAD_DIR, req.params.filename);
        await fs.unlink(filepath);
        console.log(`File deleted: ${req.params.filename}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

app.listen(PORT, () => {
    console.log(`SUS Server running on port ${PORT}`);
    console.log(`Upload directory: ${UPLOAD_DIR}`);
    console.log(`Password protection: ${PASSWORD ? 'enabled' : 'disabled'}`);
});