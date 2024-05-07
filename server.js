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

app.use(cors({
    origin: 'http://localhost:3000', // or whichever port your React app is running on
    credentials: true
}));


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


const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  const { mail, password } = req.body;
  console.log(mail, password);
  try {
    const user = await UserModel.findOne({ email: mail });
    if (!user) {
      return res.status(404).json({ message: 'User not found!!!!!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, 'your_secret_key', { expiresIn: '1h' });
    res.header('auth-token', token).json({
      message: 'Login successful!',
      token,
      user: {
        _id: user._id, // safe to return
        email: user.email, // safe to return
        fullname: user.fullname // assuming you store fullname
        // add other fields you might consider safe to return
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/logout', (req, res) => {
  res.send({ message: 'Logged out successfully' });  // Client should delete the token
});


const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied / Unauthorized request');

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

app.get('/verify', verifyToken, (req, res) => {
  res.send({ verified: true });
});

app.get('/user-profile', verifyToken, (req, res) => {
  UserModel.findById(req.user._id).select('-password')
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ message: 'Error fetching user data' }));
});



app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor.`);
});

