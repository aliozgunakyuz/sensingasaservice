const express = require('express');
const multer = require('multer');
const app = express();
const port = 8000;
const cors = require('cors');

app.use(cors()); // CORS middleware'i ekleyin

// Diğer sunucu kodları...


const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send({ message: 'Dosya başarıyla yüklendi.' });
});

// Diğer endpoint'ler...

app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor.`);
});
