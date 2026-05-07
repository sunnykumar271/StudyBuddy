const Group = require('../models/Group');
const Message = require('../models/Message');

// @desc  Create a group
// @route POST /api/groups/create
// @access Private
const createGroup = async (req, res, next) => {
  try {
    const { name, description, tags } = req.body;

    const group = await Group.create({
      name,
      description,
      tags: tags || [],
      admin: req.user._id,
      members: [req.user._id],
    });

    await group.populate('admin', 'name department');
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all groups
// @route GET /api/groups
// @access Private
const getAllGroups = async (req, res, next) => {
  try {
    const { search, tag } = req.query;
    const query = { isPublic: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (tag) query.tags = { $in: [tag] };

    const groups = await Group.find(query)
      .populate('admin', 'name department')
      .populate('members', 'name')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    next(error);
  }
};

// @desc  Get single group + its messages
// @route GET /api/groups/:id
// @access Private
const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('admin', 'name department')
      .populate('members', 'name department');

    if (!group) return res.status(404).json({ message: 'Group not found' });

    const messages = await Message.find({ group: group._id })
      .populate('sender', 'name department')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ group, messages });
  } catch (error) {
    next(error);
  }
};

// @desc  Join a group
// @route POST /api/groups/:id/join
// @access Private
const joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    group.members.push(req.user._id);
    await group.save();

    res.json({ message: 'Joined group successfully', group });
  } catch (error) {
    next(error);
  }
};

// @desc  Get my groups
// @route GET /api/groups/mine
// @access Private
const getMyGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('admin', 'name')
      .populate('members', 'name')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    next(error);
  }
};

module.exports = { createGroup, getAllGroups, getGroupById, joinGroup, getMyGroups };
