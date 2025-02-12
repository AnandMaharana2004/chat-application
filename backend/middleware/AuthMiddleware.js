import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const auth_verify = asyncHandler(async function (req, res, next) {
    const { accessToken: token } = req.cookies

    if (!token) {
        throw new ApiError(403, 'Access token is required.');
    }

    try {
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = data._id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Access token has expired.');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(403, 'Invalid access token.');
        }
        throw new ApiError(500, 'Failed to verify access token.');
    }
});

export { auth_verify }