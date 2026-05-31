const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

function getBlobServiceClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured');
  }
  return BlobServiceClient.fromConnectionString(connectionString);
}

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const containerName = process.env.AZURE_STORAGE_CONTAINER || 'resumes';
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists();

    const timestamp = Date.now();
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobName = `${timestamp}-${safeName}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: 'application/pdf' },
      metadata: {
        originalFileName: req.file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    });

    console.log(`Uploaded blob: ${blobName} (${req.file.size} bytes)`);

    res.status(201).json({
      message: 'Resume uploaded successfully',
      blobName,
      container: containerName,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to upload file' });
  }
});

router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message });
});

module.exports = router;
