import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email regex validation
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 20,
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other'],
        },
        profilePicture: {
            type: String,
            default: 'https://example.com/default-profile.png',
        },
        about: {
            type: String,
            default: 'Hey there! I am using chat-more.',
            maxlength: 150,
        },
        bio: {
            type: String,
            maxlength: 150,
        },
        lastSeen: {
            type: Date,
            default: null,
        },
        friendList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }

        ],
        blockList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        favoriteList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        unreadMessages: {
            type: Number,
            default: 0,
        },
        refreshToken: {
            type: String,
        },
        socketId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Indexes for quick lookup
userSchema.index({ email: 1, username: 1 });

// Pre-save hook for hashing passwords
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Instance method for password verification
userSchema.methods.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Instance method for generating access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// Instance method for generating refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, username: this.username },
        process.env.REFRESS_TOKEN_SECRET,
        { expiresIn: process.env.REFRESS_TOKEN_EXPIRY }
    );
};

// Export the model
export const User = mongoose.model('User', userSchema);
