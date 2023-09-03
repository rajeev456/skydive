require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Test route to check if server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Route to send email
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, phone, selectedYear, selectedMakeName, selectedModelName, selectedPart } = req.body;

        const mailOptions = {
            from: email,
            to: process.env.RECIPIENT_EMAIL,
            subject: 'New Search from the App',
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Year Selected: ${selectedYear}
                Make Selected: ${selectedMakeName}
                Model Selected: ${selectedModelName}
                Part Selected: ${selectedPart}
            `
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error('Error while sending email:', error);
        res.status(500).json({ error: 'Email failed to send.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
