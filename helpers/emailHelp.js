const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, html, body) => {
    let transporter = nodemailer.createTransport({
        host: 'giow1107.siteground.us', // Replace with Outgoing Server value
        port: 465,                   // Use port 465 for SSL
        secure: true,                // True for SSL
        auth: {
            user: process.env.EMAIL_USER,  // Your SiteGround email address
            pass: process.env.APP_PASSWORD,       // Your SiteGround email password
        },
    });
    let mailOptions = {
        from: process.env.EMAIL_USER,  // Your SiteGround email address
        to: to,
        subject: subject,
        html: html,
        body: body                     // HTML body content
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        return { success: true, info: info };
    } catch (error) {
        return { success: false, error: error };
    }
};

module.exports = {
    sendEmail,
};
