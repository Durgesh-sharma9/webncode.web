const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

/**
 * Create a new contact submission
 * POST /api/contact
 */
exports.createContact = async (req, res) => {
  try {
    // Extract form data from request body
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    // Save to MongoDB
    await contact.save();

    // Send notification email to company
    await sendNotificationEmail(contact);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });

  } catch (error) {
    // Handle errors
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message
    });
  }
};

/**
 * Get all contact submissions (Admin endpoint)
 * GET /api/contact
 */
exports.getAllContacts = async (req, res) => {
  try {
    // Fetch all contacts sorted by newest first
    const contacts = await Contact.find().sort({ createdAt: -1 });

    // Return success response with contacts
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });

  } catch (error) {
    // Handle errors
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message
    });
  }
};

/**
 * Send notification email to company
 * @param {Object} contact - Contact submission data
 */
const sendNotificationEmail = async (contact) => {
  try {
    // Create email transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Format date for email
    const date = new Date(contact.createdAt).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // Professional HTML email template with table layout
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Website Enquiry</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
          <tr>
            <td style="padding: 40px 20px;">
              <!-- Email Container -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header with Company Branding -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2563EB 0%, #06B6D4 50%, #22C55E 100%); padding: 30px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      Web n Code Technologies
                    </h1>
                    <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                      New Website Enquiry
                    </p>
                  </td>
                </tr>

                <!-- Content Section -->
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                      You have received a new enquiry from your website. Here are the details:
                    </p>

                    <!-- Information Table -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                      <tr>
                        <td style="padding: 12px 15px; background-color: #f8fafc; border-left: 4px solid #2563EB;">
                          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">${contact.name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; background-color: #ffffff; border-left: 4px solid #06B6D4;">
                          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">
                            <a href="mailto:${contact.email}" style="color: #06B6D4; text-decoration: none;">${contact.email}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; background-color: #f8fafc; border-left: 4px solid #2563EB;">
                          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">
                            <a href="tel:${contact.phone}" style="color: #2563EB; text-decoration: none;">${contact.phone}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; background-color: #ffffff; border-left: 4px solid #22C55E;">
                          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Submitted On</p>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">${date}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Message Section -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 20px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
                          <p style="margin: 0 0 10px 0; color: #2563EB; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                          <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${contact.message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #1e293b; padding: 25px 40px; text-align: center;">
                    <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                      This email was sent from the <strong style="color: #ffffff;">Web n Code Technologies</strong> website contact form.
                    </p>
                    <p style="margin: 8px 0 0 0; color: #64748b; font-size: 11px;">
                      © ${new Date().getFullYear()} Web n Code Technologies. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Plain text fallback for email clients that don't support HTML
    const textTemplate = `
      NEW WEBSITE ENQUIRY
      ===================
      
      Web n Code Technologies
      
      ENQUIRY DETAILS
      ---------------
      Name: ${contact.name}
      Email: ${contact.email}
      Phone: ${contact.phone}
      Submitted On: ${date}
      
      MESSAGE
      -------
      ${contact.message}
      
      ---
      This email was sent from the Web n Code Technologies website contact form.
      © ${new Date().getFullYear()} Web n Code Technologies. All rights reserved.
    `;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: 'New Website Enquiry - Web n Code Technologies',
      html: htmlTemplate,
      text: textTemplate
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully');

  } catch (error) {
    // Log email error but don't fail the entire submission
    console.error('Error sending notification email:', error);
  }
};
