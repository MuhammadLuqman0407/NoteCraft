import nodemailer from 'nodemailer'
import config from '../config/config.js';


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.error(" Error connecting to email server Error arise : ", error);
    }
    else {
        console.log(" Email server is ready to send message ");
    }
});

export const sendEmail = async (to, subject, text, html) => {
    if (!config.GOOGLE_USER || !config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET || !config.GOOGLE_REFRESH_TOKEN) {
        throw new Error("Missing Gmail OAuth2 credentials");
    }
    try {
        const info = await transporter.sendMail({
            from: `"NoteCraft"<${config.GOOGLE_USER}>`,
            to, // list of reciever 
            subject,
            text,
            html,
        });
        console.log("Message send: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    }
    catch (error) {
        console.error("Error sending email: ", error)
    }
}