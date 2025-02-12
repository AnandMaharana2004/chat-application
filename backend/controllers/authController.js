import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/AsyncHandler.js';
import { User } from '../models/usre.model.js';
import validateFields, { vlaidEmail } from '../utils/Validate.js';
import jwt from 'jsonwebtoken';

const generateAccessTokenAndRefressToken = async (userId) => {
    try {
        const user = await User.findById(userId).select("-password -refreshToken")
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.isVerified = true
        user.save({ validateBeforeSave: false })

        return { user, accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "falil to generate Access and Refress token")
    }

}

const Register = asyncHandler(async (req, res) => {
    const { email, username, password, confirmPassword, gender } = req.body;

    if (!email || !username || !password || !confirmPassword || !gender) {
        throw new ApiError(400, 'All fields are required from frontend');
    }

    const validationResult = validateFields(email, username, password, confirmPassword, gender)

    if (!(validationResult)) throw new ApiError(404, "All fields are require !!")

    const isEmail = vlaidEmail(email)
    if (!isEmail) throw new ApiError(404, "Invalid Email format")

    if (!(password === confirmPassword)) {
        throw new ApiError(400, 'Passwords do not match');
    }

    // const existingUser = await User.findOne({
    //     $or: [{ email }, { username }],
    // });
    const existEmail = await User.findOne({ email })
    if (existEmail) throw new ApiError(409, "Email alredy exist please login with email")

    const existUsername = await User.findOne({ username })
    if (existUsername) throw new ApiError(406, "username alredy exist try another !!")

    const profilePicUrl = `https://avatar.iran.liara.run/public/${gender == "male" ? 'boy' : 'girl'}?username=${username}`;

    const newUser = new User({
        email,
        username,
        password,
        gender,
        profilePicture: profilePicUrl,
        emailVerified: false,
    });

    await newUser.save();

    const conformUser = await User.findById(newUser._id).select('username email')
    if (!conformUser) throw new ApiError(505, 'Something went worng while creating the uer')

    return res
        .status(201)
        .json(new ApiResponse(201, conformUser, 'Registration successful..'));
});

const Login = asyncHandler(async (req, res) => {
    const { email: inputValue, password, } = req.body;

    if (!inputValue || !password) {
        throw new ApiError(400, 'fields are require from fronend');
    }

    const validationResult = validateFields(inputValue, password);
    if (!validationResult.success)
        throw new ApiError(400, 'Email/Username and Password are required');

    // const field = inputValue.includes('@') ? 'email' : 'username';
    const isEmail = vlaidEmail(inputValue)
    const field = isEmail ? 'email' : 'username'
    const user = await User.findOne({ [field]: inputValue });
    if (!user || !(await user.verifyPassword(password)))
        throw new ApiError(401, 'Invalid login credentials');

    // Generate tokens

    const { accessToken, refreshToken, user: finalUser } = await generateAccessTokenAndRefressToken(user._id)

    // Configure secure cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(new ApiResponse(200, finalUser, 'User logged in successfully'));
});

const ForgetPassword = asyncHandler((req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(404, 'Email is required');
    const user = User.findOne({ email });
    if (!user) throw new ApiError(404, 'User not found');
    // send the email with the reset password link

});

const ResetPassword = asyncHandler(async (req, res) => {
    const { userId } = req
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) throw new ApiError(503, "user not found from database")

    if (!oldPassword) throw new ApiError(404, "fild is not given by frontend")

    if (!(validateFields(oldPassword, newPassword))) throw new ApiError(404, "All fields are require")
    const result = await user.verifyPassword(oldPassword)
    if (!result) throw new ApiError(404, "Invalid password")

    user.password = newPassword
    await user.save()

    return res
        .status(202)
        .json(new ApiResponse(201, user, "Resource updated successfuly!!"))
});

const Loglout = asyncHandler(async (req, res) => {

    const { userId } = req
    if (!userId) throw new ApiError(400, "userId is require")

    const user = await User.findById(userId).select('isVerified refreshToken')
    if (!user) throw new ApiError(400, "user not found")

    user.refreshToken = null
    user.isVerified = false

    await user.save()

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('accessToken', null, cookieOptions)
        .cookie('refreshToken', null, cookieOptions)
        .json(new ApiResponse(200, null, 'User logout successfully'));
})

const ResetAccessTOken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.cookies
    if (!refreshToken) throw new ApiError(400, "Invalid creadentials")

    try {
        const userId = jwt.verify(refreshToken, process.env.REFRESS_TOKEN_SECRET)
        if (!userId) throw new ApiResponse(400, "invalid refreshToken")

        const user = await User.findById(userId).select("refreshToken")
        if (!user) throw new ApiError(400, "invalid credentinal , user not found")

        if (user.refreshToken !== refreshToken) throw new ApiError(401, "invalid credential , refresh token not match !!")

        const { refreshToken: newRefreshToken, accessToken } = await generateAccessTokenAndRefressToken(user._id)

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', newRefreshToken, cookieOptions)
            .json(new ApiResponse(200, { accessToken, newRefreshToken }, "reset accessToken successfuly !!"))

    } catch (error) {
        throw new ApiError(400, "something went wrong while reset AccessToken, try again")
    }

})

export {
    Login,
    ForgetPassword,
    Register,
    ResetPassword,
    Loglout,
    ResetAccessTOken
};
