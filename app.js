const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/createPost');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.use('/user/getPost', express.static('uploads/images'));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/route', authRoutes);

app.use('/user', upload.single('photo'), userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data
  });
});

mongoose
  .connect(
    'mongodb+srv://chandiUser:7sevens7@cluster0-uorge.mongodb.net/test?retryWrites=true&w=majority'
  )
  .then(() => app.listen(8080))
  .catch(err => console.log(err));
