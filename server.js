const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserModel = require('./database/models/userModel.js');
const ResultModel = require('./database/models/resultModel.js');
const Applet = require('./database/models/appletModel.js'); // Import Applet model

const app = express();
const port = 8001;

app.use(express.json({ limit: '50mb' }));  // Increase limit for JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Increase limit for URL-encoded payloads

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

mongoose.connect("mongodb+srv://akyuz:NZcNy0uJtIjkZLyx@sensingservice.vglbr2p.mongodb.net/?retryWrites=true&w=majority&appName=SensingService");

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

app.post('/api/results/check', async (req, res) => {
  const { modelname, camname } = req.body;
  try {
    const result = await ResultModel.findOne({ modelname, camname });
    if (result) {
      res.json({ exists: true, results: result.response });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).send('Error accessing the database');
  }
});

app.post('/api/results/save', async (req, res) => {
  console.log("Request body:", req.body);
  const { modelname, camname, results } = req.body;
  
  if (!results || !results.results || results.results.length === 0) {
    return res.status(400).send('No results available to save.');
  }
  
  // Access the nested results array
  const lastResult = results.results[results.results.length - 1];
  console.log("Last result to save:", lastResult);
  
  try {
    const newResult = new ResultModel({
      modelname,
      camname,
      response: lastResult  // Ensure this contains the necessary fields expected by ResultModel
    });
    await newResult.save();
    res.status(201).send('Results saved successfully');
  } catch (error) {
    console.error("Error when saving results:", error);
    const errorMessages = Object.values(error.errors).map(err => err.message);
    res.status(500).send(`Error saving results to the database: ${errorMessages.join(', ')}`);
  }
});

// Route to fetch user's pipelines
app.get('/api/user_pipelines', verifyToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const pipelines = await Applet.find({ userId });
    res.status(200).json(pipelines);
  } catch (error) {
    console.error('Error fetching user pipelines:', error);
    res.status(500).json({ message: 'Failed to fetch user pipelines', error });
  }
});

// Route to save pipeline data
app.post('/api/save_pipeline', verifyToken, async (req, res) => {
  const { appletName, appletId, camList, mlModelList, pythonCode } = req.body;
  const userId = req.user._id;

  try {
    const newApplet = new Applet({
      appletName,
      appletId,
      camList,
      mlModelList,
      userId,
      pythonCode
    });

    await newApplet.save();

    // Add the new applet ID to the user's appletIds array
    await UserModel.updateOne({ _id: userId }, { $push: { appletIds: newApplet._id } });

    res.status(200).json({ message: 'Pipeline saved successfully' });
  } catch (error) {
    console.error('Error saving pipeline:', error);
    res.status(500).json({ message: 'Failed to save pipeline', error });
  }
});

// Route to delete a pipeline
// Route to delete a pipeline
// Route to delete a pipeline
// Route to delete a pipeline
app.delete('/api/delete_pipeline/:id', verifyToken, async (req, res) => {
  const pipelineId = req.params.id;
  const userId = req.user._id;

  try {
    // Find the pipeline by ID and ensure it belongs to the user
    const pipeline = await Applet.findById(pipelineId);

    if (!pipeline) {
      console.error('Pipeline not found');
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    if (pipeline.userId.toString() !== userId.toString()) {
      console.error('Unauthorized attempt to delete pipeline');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete the pipeline
    await Applet.findByIdAndDelete(pipelineId);

    // Remove the pipeline ID from the user's appletIds array
    await UserModel.updateOne({ _id: userId }, { $pull: { appletIds: pipelineId } });

    res.status(200).json({ message: 'Pipeline deleted successfully' });
  } catch (error) {
    console.error('Error deleting pipeline:', error);
    res.status(500).json({ message: 'Failed to delete pipeline', error: error.message });
  }
});




app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor.`);
});
