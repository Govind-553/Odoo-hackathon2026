import User from '../models/User.js';

// @desc    Get all users in company
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ companyId: req.user.companyId })
      .select('-passwordHash')
      .populate('managerId', 'name email');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Admin
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, managerId, isManagerApprover } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password, // Pre-save hook will hash this
      role,
      companyId: req.user.companyId,
      managerId: managerId || null,
      isManagerApprover: isManagerApprover || false,
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { role },
      { new: true }
    );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign manager to user
// @route   PATCH /api/users/:id/manager
// @access  Admin
export const updateUserManager = async (req, res, next) => {
  try {
    const { managerId } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { managerId },
      { new: true }
    );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user
// @route   PATCH /api/users/:id/deactivate
// @access  Admin
export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { isActive: false },
      { new: true }
    );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
