import nodemailer from 'nodemailer';

const provider = (process.env.MAIL_PROVIDER || (process.env.GMAIL_APP_PASSWORD ? 'gmail' : 'brevo')).toLowerCase();

let transporter;

if (provider === 'gmail') {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    if (!process.env.SENDER_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('Gmail mail provider selected but SENDER_EMAIL/GMAIL_APP_PASSWORD is missing. Email sending will fail until configured.');
    }
} else {
    transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('Brevo mail provider selected but SMTP_USER/SMTP_PASS is missing. Email sending will fail until configured.');
    }
}

// Verify connection configuration at startup (helps diagnose SMTP issues quickly)
// Do not run during tests to avoid external network calls.
if (process.env.NODE_ENV !== 'test') {
    transporter
        .verify()
        .then(() => {
            console.log(`SMTP Server is ready to send emails (provider: ${provider})`);
        })
        .catch((error) => {
            console.log(`SMTP Connection Error (provider: ${provider}):`, error?.message || error);
        });
}

export default transporter;