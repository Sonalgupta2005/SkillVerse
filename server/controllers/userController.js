const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const { skill, page = 1, limit = 6, search } = req.query;

    let query = {
      profileVisibility: 'public',
      banned: false
    };
    console.log("Query Params:", req.user);
    // 🔥 EXCLUDE LOGGED-IN USER
    if (req.user && req.user._id) {
      query._id = { $ne: req.user._id };
    }

    // Skill filter
    if (skill) {
      query.skillsOffered = Array.isArray(skill)
        ? { $in: skill }
        : skill;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { skillsOffered: new RegExp(search, 'i') },
        { skillsWanted: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(query)
      .select('-password -email')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      users
    });
  } catch (err) {
    next(err);
  }
};



exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userRequesting = req.user;

    const user = await User.findById(userId).select('-password').lean();
    if(!user) return res.status(404).json({ message: 'User not found' });

    // Check profile visibility unless admin or self
    if(user.profileVisibility === 'private' && userRequesting.role !== 'admin' && userRequesting.id.toString() !== userId) {
      return res.status(403).json({message:'Profile is private'});
    }

    if(user.banned && userRequesting.role !== 'admin' && userRequesting.id.toString() !== userId) {
      return res.status(403).json({message:'User is banned'});
    }

    // Hide email from others except admin or self
    if(userRequesting.role !== 'admin' && userRequesting.id.toString() !== userId) {
      delete user.email;
    }

    res.json({ user });
  } catch(err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const allowedFields = [
      'name',
      'location',
      'profilePhoto',
      'skillsOffered',
      'skillsWanted',
      'availability',
      'password'
    ];

    const updates = {};
     //console.log(req.body);
    // Allowed skill levels
    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'skillsOffered' || field === 'skillsWanted') {
          if (Array.isArray(req.body[field])) {
            updates[field] = req.body[field].filter(skill =>
              skill &&
              typeof skill.name === 'string' &&
              validLevels.includes(skill.level)
            ).map(skill => ({
              name: skill.name,
              level: skill.level
            }));
          }
        } else {
          updates[field] = req.body[field];
        }
      }
    });
    console.log(req.body);
    // Hash password if it's being updated
    if (updates.password) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};


exports.updateVisibility = async (req, res, next) => {
  try {
    const { profileVisibility } = req.body;
    if(!['public','private'].includes(profileVisibility)){
      return res.status(400).json({message:'Invalid profileVisibility value'});
    }

    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(userId, {profileVisibility}, {new:true}).select('-password');
    res.json({
      success: true,
      message: "Profile visibility updated successfully",
      user: updatedUser});
  } catch(err) {
    next(err);
  }
};