const jwt  = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userID) => {
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('token', token, {
        httpOnly: true, // The cookie is accessible only to the web server and not client side js (XSS)
        secure: process.env.NODE_ENV === 'production', // https
        sameSite: 'strict', // csrf attack
        maxAge : 7 * 24 * 60 * 60 * 1000
    });

    return token;
};

module.exports = generateTokenAndSetCookie;