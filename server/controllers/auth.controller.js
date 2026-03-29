import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.js';
import Company from '../models/Company.js';

const generateToken = (userId, role, companyId) => {
  return jwt.sign({ userId, role, companyId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register user and company
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, companyName, country } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Fetch currency from REST Countries API
    let defaultCurrency = 'USD'; // Fallback
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${country}?fullText=true&fields=currencies`);
      if (response.data && response.data.length > 0) {
        const currencies = response.data[0].currencies;
        defaultCurrency = Object.keys(currencies)[0];
      }
    } catch (error) {
      console.error('REST Countries API error:', error.message);
      // Continue with fallback USD
    }

    // Create Company
    const company = await Company.create({
      name: companyName,
      country,
      defaultCurrency,
    });

    // Create Admin User
    const user = await User.create({
      name,
      email,
      passwordHash: password, // Pre-save hook will hash this
      role: 'admin',
      companyId: company._id,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          token: generateToken(user._id, user.role, user.companyId),
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          token: generateToken(user._id, user.role, user.companyId),
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('companyId');
    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
