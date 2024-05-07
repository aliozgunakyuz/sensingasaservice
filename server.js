const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 8001;
const mongoose = require('mongoose');
const UserModel = require('./database/models/userModel.js')

app.use(express.json());
app.use(cors()); // Enable CORS

const upload = multer({ dest: 'uploads/' });

const VIDEO_DIRECTORY = '/Users/ozgun/Desktop/videos';

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

mongoose.connect("mongodb+srv://akyuz:NZcNy0uJtIjkZLyx@sensingservice.vglbr2p.mongodb.net/?retryWrites=true&w=majority&appName=SensingService")


app.post('/register', async (req, res) => {
  const { fullname, mail, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      fullname,
      email: mail, // Make sure the schema expects 'email' not 'mail'
      password: hashedPassword
    });

    res.json({ message: 'User registered successfully!', user });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) { // Handle duplicate key error
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});


app.post('/login', async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: mail });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    res.json({ message: 'Login successful!', user }); // Consider using authentication tokens here
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor.`);
});

