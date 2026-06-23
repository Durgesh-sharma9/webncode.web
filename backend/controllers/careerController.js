const Application = require('../models/Application');
const nodemailer = require('nodemailer');

exports.submitApplication = async (req, res) => {
  try {
    const data = req.body;
    
    // Extract base64 resume and its metadata, then remove from DB save payload
    const resumeBase64 = data.resumeBase64;
    const resumeName = data.resumeName || 'resume.pdf';
    
    // Validate required fields
    if (!data.fullName || !data.email || !data.mobile || !data.position || !data.declaration) {
      return res.status(400).json({ success: false, message: 'Essential fields are missing.' });
    }

    // Save to MongoDB
    const application = new Application({
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      city: data.city,
      state: data.state,
      gender: data.gender,
      linkedin: data.linkedin,
      github: data.github,
      portfolio: data.portfolio,
      position: data.position,
      employmentType: data.employmentType,
      experience: data.experience,
      currentCompany: data.currentCompany,
      currentRole: data.currentRole,
      noticePeriod: data.noticePeriod,
      builtProduct: data.builtProduct,
      projectLinks: data.projectLinks,
      whyJoin: data.whyJoin,
      college: data.college,
      course: data.course,
      currentYear: data.currentYear,
      graduationYear: data.graduationYear,
      resumeName: resumeName,
      declaration: data.declaration
    });

    await application.save();

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Prepare attachments
    const attachments = [];
    if (resumeBase64) {
      // Split base64 data URL to get only the content
      const base64Content = resumeBase64.split('base64,')[1];
      if (base64Content) {
        attachments.push({
          filename: resumeName,
          content: base64Content,
          encoding: 'base64'
        });
      }
    }

    // 1. Email to HR (careers@webncode.in)
    const hrHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="background: #111; color: #fff; padding: 15px; text-transform: uppercase;">New Application: ${data.position}</h2>
        
        <h3 style="border-bottom: 2px solid #ccc; padding-bottom: 5px;">Section 1: Personal Details</h3>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Mobile:</strong> ${data.mobile}</p>
        <p><strong>Location:</strong> ${data.city}, ${data.state}</p>
        <p><strong>Gender:</strong> ${data.gender}</p>

        <h3 style="border-bottom: 2px solid #ccc; padding-bottom: 5px;">Section 2: Professional Links</h3>
        <p><strong>LinkedIn:</strong> ${data.linkedin || 'N/A'}</p>
        <p><strong>GitHub:</strong> ${data.github || 'N/A'}</p>
        <p><strong>Portfolio:</strong> ${data.portfolio || 'N/A'}</p>

        <h3 style="border-bottom: 2px solid #ccc; padding-bottom: 5px;">Section 3: Career Details</h3>
        <p><strong>Employment Type:</strong> ${data.employmentType}</p>
        <p><strong>Experience:</strong> ${data.experience}</p>
        <p><strong>Notice Period:</strong> ${data.noticePeriod}</p>
        <p><strong>Current Company:</strong> ${data.currentCompany || 'N/A'}</p>
        <p><strong>Current Role:</strong> ${data.currentRole || 'N/A'}</p>

        ${data.employmentType === 'Internship' ? `
          <h3 style="border-bottom: 2px solid #ccc; padding-bottom: 5px;">Section 5: Internship Details</h3>
          <p><strong>College:</strong> ${data.college || 'N/A'}</p>
          <p><strong>Course:</strong> ${data.course || 'N/A'}</p>
          <p><strong>Current Year:</strong> ${data.currentYear || 'N/A'}</p>
          <p><strong>Graduation Year:</strong> ${data.graduationYear || 'N/A'}</p>
        ` : ''}

        <h3 style="border-bottom: 2px solid #ccc; padding-bottom: 5px;">Section 4: Product Builder Questions</h3>
        <p><strong>Built a software product before?</strong> ${data.builtProduct}</p>
        <p><strong>Project Links:</strong><br/>${data.projectLinks || 'N/A'}</p>
        <p><strong>Why join Web n Code?</strong><br/>${data.whyJoin}</p>
        
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          Applicant confirmed declaration. Resume is attached.
        </p>
      </div>
    `;

    const hrMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL, // Target email
      subject: `New Application: ${data.fullName} - ${data.position}`,
      html: hrHtml,
      attachments: attachments
    };

    // 2. Email to Applicant
    const applicantHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2>Application Received</h2>
        <p>Hi ${data.fullName},</p>
        <p>Thank you for applying for the <strong>${data.position}</strong> position at Web n Code Technologies.</p>
        <p>We have received your application and resume successfully. Our product team will review your profile and get back to you if your skills match our current requirements.</p>
        <br/>
        <p>Best regards,<br><strong>Web n Code Technologies Team</strong></p>
      </div>
    `;

    const applicantMailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: `Application Received - ${data.position} at Web n Code Technologies`,
      html: applicantHtml
    };

    // Send emails
    try {
      await transporter.sendMail(hrMailOptions);
      await transporter.sendMail(applicantMailOptions);
      console.log('Career emails sent successfully');
    } catch (emailError) {
      console.error('Error sending career emails:', emailError);
      // We don't fail the whole request if email fails, but we log it.
    }

    res.status(201).json({ success: true, message: 'Application submitted successfully.' });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};
