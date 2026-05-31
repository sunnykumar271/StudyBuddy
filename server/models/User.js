const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    otp: {
  type: String,
  default: null,
  select: false,   // never returned in queries by default
},
    otpExpiry: {
    type: Date,
    default: null,
    select: false,
},
    isOtpVerified: {
    type: Boolean,
    default: false,
},
    resetOtp: {
      type: String,
      default: null,
           },
    
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: '',
    },
    department: {
      type: String,
      default: '',
      enum: [
        '',
        'Computer Science',
        'Electronics',
        'Mechanical',
        'Civil',
        'Chemical',
        'Physics',
        'Mathematics',
        'Biology',
        'Economics',
        'Business',
        'Arts',
        'Other',
      ],
    },
    year: {
      type: String,
      enum: ['', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'],
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    subjects: {
      type: [String],
      default: [],
    },
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
