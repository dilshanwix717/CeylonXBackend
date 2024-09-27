const emailHelp = require('../helpers/emailHelp');

class EmailController {

    // Function to send project request email
    async sendProjectRequestEmail(req, res) {
        const { name, company, description, email, referral } = req.body;

        // Basic validation
        if (!name || !company || !description || !email || !referral) {
            throw new Error('All fields are required to send email');
        }

        const to = "dwixpesmobile@gmail.com";  // Send to the same email address provided
        const subject = 'Project Request ';
        const html = `
            <p>Hey, Ceylon X! </p>
            <p>I'm ${name} from ${company} . I'd like to ${description} and you can reach me at 
            ${email} . By the way, I heard about Ceylon X from ${referral}.</p>
        `;

        try {
            const result = await emailHelp.sendEmail(to, subject, html, '');
            return result.success;
        } catch (error) {
            throw error;
        }
    }

    // Function to send project request confirmation email
    async sendProjectRequestConfirmEmail(projectRequest) {
        const { name, company, description, email, referral } = projectRequest;

        // Basic validation
        if (!name || !company || !description || !email || !referral) {
            throw new Error('All fields are required to send email');
        }

        const to = email;  // Send to the same email address provided
        const subject = 'Project Request Confirmation';
        const html = `
        <p>Dear ${name},</p>
        <p>Thank you for submitting a project request. Below are the details of your request:</p>
        <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Description:</strong> ${description}</li>
            <li><strong>Referral:</strong> ${referral}</li>
        </ul>
        <p>We will get back to you shortly.</p>
        <p>Best regards,<br/>The Project Team</p>
    `;

        try {
            const result = await emailHelp.sendEmail(to, subject, html, '');
            return result.success;
        } catch (error) {
            throw error;
        }
    }


    // Function to send job application email


    async sendJobApplicationEmail(req, res) {
        const { name, title, category, email, mobile, referral } = req.body;

        // Basic validation
        if (!category || !title || !name || !email || !mobile || !referral) {
            return res.status(400).json({ message: 'All fields are required to send email' });
        }

        const to = "dwixpesmobile@gmail.com";  // Send to the same email address provided
        const subject = 'Job Application ';
        const html = `
            <p>Hey, Ceylon X! </p>
            <p>I'm ${name} and I'm applying for this ${title} position. My email address is
            ${email}, and phone number is ${mobile} By the way, I heard about Ceylon X from ${referral}.</p>
        `;

        try {
            const result = await emailHelp.sendEmail(to, subject, html, '');
            return result.success;
        } catch (error) {
            throw error;
        }
    }


    async sendJobApplicationConfirmEmail(jobApplication) {
        const { name, title, category, email, mobile, referral } = jobApplication;

        // Basic validation
        if (!category || !title || !name || !email || !mobile || !referral) {
            throw new Error('All fields are required to send email');
        }

        const to = email;  // Send to the same email address provided
        const subject = 'Project Request Confirmation';
        const html = `
            <p>Dear ${name},</p>
            <p>Thank you for submitting a job application. Below are the details of your request:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Job category:</strong> ${category}</li>
                <li><strong>Job title:</strong> ${title}</li>
                <li><strong>Referral:</strong> ${referral}</li>
            </ul>
            <p>We will get back to you shortly.</p>
            <p>Best regards,<br/>The Project Team</p>
        `;

        try {
            const result = await emailHelp.sendEmail(to, subject, html, '');
            return result.success;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new EmailController();
