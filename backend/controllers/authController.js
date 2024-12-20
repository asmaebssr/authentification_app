const User = require('../model/userModel')
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const generateTokenAndSetCookie  = require('../utils/generateTokenAndSetCookie');
const {
    sendVerificationEmail, 
    sendWelcomeEmail, 
    sendResetPasswordEmail,
    sendResetSuccessEmail
} = require('../mailer/emails');

const signup = async (req, res) => {

    const {email, password, name} = req.body;

    try{
        if(!email || !password || !name)
        {
            throw new Error('All field are required');
        };

        const userAlreadyExists = await User.findOne({email});


        if(userAlreadyExists)
        {
            return res.status(400).json({
                success: false, 
                message: 'User already exists'
            });
        };

        const hashedPassword = await bcryptjs.hash(password, 10);

        const verificationToken = Math.floor(Math.random() * 900000 + 100000).toString();

        const user = new User({
            email, 
            password: hashedPassword, 
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true, 
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined
            }

        });

    }catch(error)
    {
        return res.status(400).json({
            success: false, 
            message: error.message
        });
    };
};

const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired verification code' 
            });
        };

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (error) {
            console.error('Failed to send welcome email:', error.message);
        }

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error('Error in verifyEmail', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error' 
        });
    };
};

const login = async (req, res) => {

    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credendials'
            });
        };

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credendials'
            });
        };

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log('Error in login', error);
        res.status(400).json({
            success: false,
            message: error.message
        })
    };
};

const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: 'logged out successfully'
    });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        };
 
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendResetPasswordEmail(
            user.email, 
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });

    } catch (error) {
        console.log('Error in forgotPassword', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const resetPassword = async (req, res) => {

    try {

        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        };

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: 'Password reset successfull'
        });

    } catch (error) {
        console.log('Error in resetPassword', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const checkAuth = async (req, res) => {
    try {

        const user = await User.findById(req.userID).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        };

        res.status(200).json({
            success: true,
            user
            // user: {
            //     ...user._doc,
            //     password: undefined
            // }
        });

    } catch (error) {
        console.log('Error in checkAuth', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    };
};


module.exports = {
    signup,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth
}