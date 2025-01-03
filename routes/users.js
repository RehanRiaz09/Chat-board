const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limit: { file: 5 * 1024 * 1024 },
});

// Signup the user
routes.post('/signup', upload.single('image'), async (req, res, next) => {
  const { userName, email, password } = req.body;
  if ((!userName, !email, !password)) {
    return res.status(400).json({
      Message: 'Username email and password are required',
    });
  }
  try {
    const userExists = await User.findOne({ userName, email });
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this mail',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (password === confirmPassword);
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      confirmPassword: req.body.confirmPassword,
      image: req.file ? req.file.path : null,
      online: req.body.online,
    });
    await user.save();
    res.status(201).json({
      message: 'User signup sucessfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

routes.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        message: 'Invalid email or password',
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret', // Replace with your JWT secret
      { expiresIn: '1h' }
    );
    res.status(201).json({
      message: 'Login sucessfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

// get all users
routes.get('/', async (req, res, next) => {
  try {
    const docs = await User.find();
    res.status(200).json({
      count: docs.length,
      User: docs,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

// Get by id
routes.get('/:userId', async (req, res, next) => {
  try {
    const id = req.params.userId;
    const doc = await User.findById(id);
    console.log(doc);
    if (doc) {
      res.status(200).json({
        user: doc,
      });
    } else {
      res.status(404).json({
        message: 'No valid entry found for the this provide ID',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

// Update the user
routes.patch('/:userId', upload.single('image'), async (req, res, next) => {
  const id = req.params.userId;
  const { userName, email, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    //     const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          image: req.file ? req.file.path : null,
          online: req.body.online,
        },
      }
    );
    res.status(200).json({
      message: 'User update sucessfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

// Delete the user
routes.delete('/:userId', async (req, res, next) => {
  try {
    const id = req.params.userId;
    await User.deleteOne({ _id: id });
    res.status(201).json({
      message: 'User deleted',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});
module.exports = routes;
