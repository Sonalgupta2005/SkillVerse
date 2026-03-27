const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const maxAgeSec = 7 * 24 * 60 * 60; //7 days

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: maxAgeSec});
};

exports.signup = async (req, res, next) => {
  try {
    const {name, email, password, location, profilePhoto, skillsOffered, skillsWanted, availability} = req.body;

    // Check if user exists
    const userExists = await User.findOne({email});
    if(userExists) return res.status(400).json({message: "Email already in use"});

    const user = await User.create({
      name, email, password, location, profilePhoto,
      skillsOffered, skillsWanted, availability,
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: maxAgeSec * 1000,
    });

    res.status(201).json({
        success: true,
        message: "Signup successful",
        user: {
        _id: user._id, id: user._id, name: user.name, email: user.email, role: user.role,
        location: user.location, skillsOffered: user.skillsOffered, skillsWanted: user.skillsWanted,
        availability: user.availability, profileVisibility: user.profileVisibility, banned: user.banned,
      }
    });
  } catch(err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'Invalid credentials'});

    if(user.banned) return res.status(403).json({message:'Account banned.'});

    const isMatch = await user.matchPassword(password);
    if(!isMatch)  return res.status(400).json({message:'Invalid credentials'});

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: maxAgeSec * 1000,
    });

    res.json({
      success: true,
      message: "Signin successful",
      user: {
        _id: user._id, id: user._id, name: user.name, email: user.email, role: user.role,
        location: user.location, skillsOffered: user.skillsOffered, skillsWanted: user.skillsWanted,
        availability: user.availability, profileVisibility: user.profileVisibility, banned: user.banned,
      }
    });
  } catch(err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'None',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({message:'Logged out'});
};

exports.getMe = async (req, res, next) => {
  try {
    // req.user is already populated in authMiddleware
    res.json({user: req.user});
  } catch(err) {
    next(err);
  }
};