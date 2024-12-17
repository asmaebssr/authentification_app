const User = require('../model/userModel')
const bcryptjs = require('bcryptjs');
const generateTokenAndSetCookie  = require('../utils/generateTokenAndSetCookie');
const {sendVerificationEmail, sendWelcomeEmail} = require('../mailer/emails');

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
    res.send('Login route');
};

const logout = async (req, res) => {
    res.send('Logout route');
};


module.exports = {
    signup,
    verifyEmail,
    login,
    logout
}