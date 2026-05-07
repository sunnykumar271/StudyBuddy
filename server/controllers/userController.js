const User = require('../models/User');
const Connection = require('../models/Connection');

// Compute match score between two users
const computeMatchScore = (userA, userB) => {
  const setA = new Set([
    ...userA.interests.map((s) => s.toLowerCase()),
    ...userA.skills.map((s) => s.toLowerCase()),
    ...userA.subjects.map((s) => s.toLowerCase()),
  ]);
  const setB = new Set([
    ...userB.interests.map((s) => s.toLowerCase()),
    ...userB.skills.map((s) => s.toLowerCase()),
    ...userB.subjects.map((s) => s.toLowerCase()),
  ]);
  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return Math.round((intersection.length / union.size) * 100);
};

// @desc  Get all users with optional filters
// @route GET /api/users
// @access Private
const getAllUsers = async (req, res, next) => {
  try {
    const { department, interest, search, page = 1, limit = 20 } = req.query;
    const query = { _id: { $ne: req.user._id } };

    if (department) query.department = department;
    if (interest) query.interests = { $in: [interest] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc  Get smart matches for current user
// @route GET /api/users/matches
// @access Private
const getMatches = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const otherUsers = await User.find({ _id: { $ne: req.user._id } }).select('-password');

    const matches = otherUsers
      .map((u) => ({
        user: u,
        matchScore: computeMatchScore(currentUser, u),
      }))
      .filter((m) => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);

    res.json(matches);
  } catch (error) {
    next(error);
  }
};

// @desc  Get user by ID
// @route GET /api/users/:id
// @access Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('connections', 'name department');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check connection status with current user
    const connection = await Connection.findOne({
      $or: [
        { sender: req.user._id, receiver: user._id },
        { sender: user._id, receiver: req.user._id },
      ],
    });

    res.json({ user, connectionStatus: connection ? connection.status : null, connectionId: connection?._id });
  } catch (error) {
    next(error);
  }
};

// @desc  Edit current user profile
// @route PUT /api/users/edit-profile
// @access Private
const editProfile = async (req, res, next) => {
  try {
    const { name, bio, department, year, skills, interests, subjects } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, department, year, skills, interests, subjects },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc  Complete onboarding
// @route PUT /api/users/onboarding
// @access Private
const completeOnboarding = async (req, res, next) => {
  try {
    const { bio, department, year, skills, interests, subjects } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, department, year, skills, interests, subjects, onboardingComplete: true },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getMatches, getUserById, editProfile, completeOnboarding };
