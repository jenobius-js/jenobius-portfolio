const nodemailer = require('nodemailer');
require('dotenv').config();

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
        };
    }

    // Directly use event.body as a string
    const formData = new URLSearchParams(event.body);

    const name = formData.get('name');
    const mobile = formData.get('mobile');
    const email = formData.get('email');
    const subject = formData.get('subject');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nMobile: ${mobile}\nEmail: ${email}\nSubject: ${subject}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Form submitted successfully!' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: `Error: ${error.toString()}` })
        };
    }
};
