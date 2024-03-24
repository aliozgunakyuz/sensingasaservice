const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 8001;

app.use(cors()); // Enable CORS

const upload = multer({ dest: 'uploads/' });

// Directory where videos are stored
const VIDEO_DIRECTORY = '/Users/ozgun/Desktop/videos';

// Middleware to serve videos statically from the specified directory
app.use('/videos', express.static(VIDEO_DIRECTORY));

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send({ message: 'Dosya başarıyla yüklendi.' });
});

// Route to list all videos in the directory
app.get('/list_videos', (req, res) => {
  fs.readdir(VIDEO_DIRECTORY, (err, files) => {
    if (err) {
      console.error('Error listing video files:', err);
      res.status(500).send({ error: 'Video dosyaları listelenirken bir hata oluştu.' });
      return;
    }
    const mp4Files = files.filter(file => file.endsWith('.mp4')); // Filter for .mp4 files
    res.send(mp4Files);
  });
});


app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor.`);
});
