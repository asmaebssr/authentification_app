const {nodemailerClient, sender } = require("./nodemailer")
const { 
    VERIFICATION_EMAIL_TEMPLATE, 
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE
} = require("./emailTemplates");

const sendVerificationEmail = async(email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await nodemailerClient.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: recipient[0].email,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                '{verificationCode}', verificationToken
            ),
            category: 'Email Verification'
        })
        console.log('Email sent successfully', response)
    } catch (error) {
        console.log('Error sending verification email', error);
        throw new Error(`Error sending verification email: ${error}`)
    }
};

const sendWelcomeEmail = async (email, name) => {
    const emailHTML = WELCOME_EMAIL_TEMPLATE.replace('{name}', name);

    try {
        await nodemailerClient.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: 'Welcome to Our Platform!',
            html: emailHTML,
        });
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error.message);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await nodemailerClient.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: recipient[0].email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
                '{resetURL}', resetURL
            ),
            category: 'Password Reset'
        });

        console.log('Reset password sent successfully', response)
        
    } catch (error) {
        console.error('Error sending password reset email', error);
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]

    try {
        const response = await nodemailerClient.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: recipient[0].email,
            subject: 'Password reset successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'Password reset'
        })
        console.log('Password reset email sent successfully', response)
    } catch (error) {
        console.log('Error sending password reset success email', error);
        throw new Error(`Error sending password reset success email: ${error}`)
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendResetPasswordEmail,
    sendResetSuccessEmail
};