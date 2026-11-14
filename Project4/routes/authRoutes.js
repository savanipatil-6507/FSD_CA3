/**
 * Authentication Routes (Register and Login using bcrypt & JWT)
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../data/store');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'hospital_appointment_secret_jwt_key_2026';

// Register a new staff/doctor account
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Username and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long.'
      });
    }

    const existingUser = store.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'A user with that username already exists.'
      });
    }

    // Hash password with bcrypt salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'USR-' + (store.users.length + 1),
      username,
      passwordHash,
      role: role || 'medical_staff',
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully with bcrypt encryption.',
      data: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login and issue JWT token
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Username and password are required.'
      });
    }

    const user = store.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'Invalid username or password credentials.'
      });
    }

    // Verify bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'Invalid username or password credentials.'
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful. JWT token generated.',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

