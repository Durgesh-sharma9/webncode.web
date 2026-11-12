const Intern = require('../models/Intern');
const { createTransporter, getFromAddress } = require('../config/mailer');

/**
 * Generate next sequential reference code
 * Format: WNC/SI/FSD/YY/001 (Fixed prefix, YY = 2-digit year, 3-digit serial starting from 001)
 * GET /api/interns/next-ref
 */
exports.getNextReference = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const prefix = `WNC/SI/FSD/${currentYear}/`;

    const interns = await Intern.find({
      $or: [
        { offerLetterRef: { $regex: `^WNC/SI/FSD/${currentYear}/`, $options: 'i' } },
        { certificateRef: { $regex: `^WNC/SI/FSD/${currentYear}/`, $options: 'i' } }
      ]
    });

    const usedNumbers = new Set();
    interns.forEach((intern) => {
      [intern.offerLetterRef, intern.certificateRef].forEach((ref) => {
        if (ref) {
          const match = ref.match(/WNC\/SI\/FSD\/\d{2}\/(\d+)/i);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num)) {
              usedNumbers.add(num);
            }
          }
        }
      });
    });

    // Find the smallest unused positive sequence starting from 1
    let nextNum = 1;
    while (usedNumbers.has(nextNum)) {
      nextNum++;
    }

    const nextRef = `${prefix}${String(nextNum).padStart(3, '0')}`;

    res.json({
      success: true,
      nextRef,
      prefix,
      year: currentYear,
      seq: nextNum
    });
  } catch (error) {
    console.error('Error in getNextReference:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all interns with optional search and filters
 * GET /api/interns
 */
exports.getInterns = async (req, res) => {
  try {
    const { search, status, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } },
        { offerLetterRef: { $regex: search, $options: 'i' } },
        { certificateRef: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && ['draft', 'approved', 'revoked'].includes(status)) {
      query.certificateStatus = status;
    }

    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const interns = await Intern.find(query).sort(sortOption);

    res.json({
      success: true,
      count: interns.length,
      data: interns
    });
  } catch (error) {
    console.error('Error in getInterns:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single intern by ID
 * GET /api/interns/:id
 */
exports.getInternById = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }
    res.json({ success: true, data: intern });
  } catch (error) {
    console.error('Error in getInternById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create new intern
 * POST /api/interns
 */
exports.createIntern = async (req, res) => {
  try {
    const internData = req.body;
    if (!internData.name || !internData.email) {
      return res.status(400).json({ success: false, message: 'Intern name and email are required.' });
    }

    const intern = new Intern(internData);
    await intern.save();

    res.status(201).json({
      success: true,
      message: 'Intern added successfully',
      data: intern
    });
  } catch (error) {
    console.error('Error in createIntern:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update intern details
 * PUT /api/interns/:id
 */
exports.updateIntern = async (req, res) => {
  try {
    const intern = await Intern.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    res.json({
      success: true,
      message: 'Intern details updated successfully',
      data: intern
    });
  } catch (error) {
    console.error('Error in updateIntern:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete intern
 * DELETE /api/interns/:id
 */
exports.deleteIntern = async (req, res) => {
  try {
    const intern = await Intern.findByIdAndDelete(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    res.json({
      success: true,
      message: 'Intern removed successfully'
    });
  } catch (error) {
    console.error('Error in deleteIntern:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update certificate approval status
 * PATCH /api/interns/:id/status
 */
exports.updateCertificateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'approved', 'revoked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid certificate status' });
    }

    const intern = await Intern.findByIdAndUpdate(
      req.params.id,
      { certificateStatus: status },
      { new: true }
    );

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    res.json({
      success: true,
      message: `Certificate status updated to ${status}`,
      data: intern
    });
  } catch (error) {
    console.error('Error in updateCertificateStatus:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Public Certificate Verification
 * GET /api/interns/verify/:ref
 */
exports.verifyCertificatePublic = async (req, res) => {
  try {
    const ref = decodeURIComponent(req.params.ref).trim();

    // Find by certificateRef, offerLetterRef, or MongoDB _id
    let query = {
      $or: [
        { certificateRef: { $regex: `^${ref}$`, $options: 'i' } },
        { offerLetterRef: { $regex: `^${ref}$`, $options: 'i' } }
      ]
    };

    if (ref.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: ref });
    }

    const intern = await Intern.findOne(query);

    if (!intern) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'No certificate found matching this reference number.'
      });
    }

    if (intern.certificateStatus !== 'approved') {
      return res.status(200).json({
        success: true,
        verified: false,
        status: intern.certificateStatus,
        message: 'This certificate is currently pending administrative approval or is inactive.',
        intern: {
          name: intern.name,
          college: intern.college,
          certificateRef: intern.certificateRef,
          status: intern.certificateStatus
        }
      });
    }

    // Return public verification details
    res.json({
      success: true,
      verified: true,
      status: 'approved',
      message: 'Official Verified Certificate from Web n Code Technologies.',
      intern: {
        _id: intern._id,
        name: intern.name,
        email: intern.email,
        college: intern.college,
        course: intern.course,
        domain: intern.domain,
        department: intern.department,
        mode: intern.mode,
        duration: intern.duration,
        startDate: intern.startDate,
        endDate: intern.endDate,
        certificateRef: intern.certificateRef,
        certificateIssueDate: intern.certificateIssueDate,
        certificateEvaluation: intern.certificateEvaluation,
        signatory: {
          name: 'Mr. Narendra Singh Chaudhary',
          title: 'Founder/Director',
          company: 'Web n Code Technologies'
        }
      }
    });
  } catch (error) {
    console.error('Error in verifyCertificatePublic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send Offer Letter Email to Intern
 * POST /api/interns/:id/send-offer-letter
 */
exports.sendOfferLetterEmail = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    const { pdfBase64, customMessage } = req.body;
    const transporter = createTransporter();

    const firstName = intern.name.replace(/^(mr\.|ms\.|mrs\.|dr\.)\s+/i, '').split(' ')[0] || intern.name;

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0284c7; height: 6px;"></div>
        <div style="padding: 24px 30px; border-bottom: 1px solid #f1f5f9;">
          <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 800;">Web n Code Technologies</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px; font-weight: 600;">Code ❖ Innovate ❖ Growth</p>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 15px; margin-top: 0;">Dear <strong>${firstName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Congratulations! We are delighted to formally offer you an internship opportunity at <strong>Web n Code Technologies</strong>.
          </p>

          <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px 20px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Position:</strong> ${intern.domain}</p>
            <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Duration:</strong> ${intern.duration}</p>
            ${intern.stipend && intern.stipend.trim() ? `<p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Stipend:</strong> ${intern.stipend}</p>` : ''}
            <p style="margin: 0; font-size: 13px;"><strong>Reference No:</strong> ${intern.offerLetterRef}</p>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Please review the attached official Offer Letter document for complete details, responsibilities, and terms.
            To confirm your acceptance, kindly sign and return a copy of the letter by <strong>${intern.acceptanceDueDate}</strong>.
          </p>

          ${customMessage ? `<p style="font-size: 13px; color: #475569; background: #e0f2fe; padding: 12px; border-radius: 6px;">${customMessage}</p>` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">Warm Regards,</p>
            <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Mr. Narendra Singh Chaudhary</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Founder & Director, Web n Code Technologies</p>
          </div>
        </div>

        <div style="background: #0f172a; padding: 16px 30px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">Web n Code Technologies • Mahapura, Ajmer Road, Jaipur, Rajasthan 302026</p>
          <p style="margin: 4px 0 0 0;"><a href="https://webncode.in" style="color: #38bdf8; text-decoration: none;">www.webncode.in</a> • webncodetechnologies@gmail.com</p>
        </div>
      </div>
    `;

    const attachments = [];
    if (pdfBase64) {
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      attachments.push({
        filename: `Offer_Letter_${intern.name.replace(/\s+/g, '_')}.pdf`,
        content: Buffer.from(base64Data, 'base64'),
        contentType: 'application/pdf'
      });
    }

    await transporter.sendMail({
      from: getFromAddress(),
      to: intern.email,
      cc: process.env.COMPANY_EMAIL || 'webncodetechnologies@gmail.com',
      subject: `Summer Internship Offer Letter – ${intern.name} (${intern.offerLetterRef})`,
      html: emailHtml,
      attachments
    });

    intern.offerLetterSentAt = new Date();
    await intern.save();

    res.json({
      success: true,
      message: `Offer letter successfully dispatched to ${intern.email}`
    });
  } catch (error) {
    console.error('Error sending offer letter email:', error);
    res.status(500).json({ success: false, message: `Failed to send email: ${error.message}` });
  }
};

/**
 * Send Certificate Email to Intern
 * POST /api/interns/:id/send-certificate
 */
exports.sendCertificateEmail = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    if (intern.certificateStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Certificate must be in "Approved" status before sending to the candidate.'
      });
    }

    const { pdfBase64 } = req.body;
    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL || 'https://webncode.in'}/verify-certificate/${encodeURIComponent(intern.certificateRef)}`;
    const firstName = intern.name.replace(/^(mr\.|ms\.|mrs\.|dr\.)\s+/i, '').split(' ')[0] || intern.name;

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #1d4ed8, #0284c7); height: 6px;"></div>
        <div style="padding: 24px 30px; border-bottom: 1px solid #f1f5f9;">
          <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 800;">Web n Code Technologies</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px; font-weight: 600;">BUILD ❖ SOLVE ❖ GROW</p>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 15px; margin-top: 0;">Dear <strong>${firstName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Heartiest congratulations on successfully completing your internship at <strong>Web n Code Technologies</strong>!
            Your official Certificate of Internship has been generated, digitally verified, and issued.
          </p>

          <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px 20px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Candidate:</strong> ${intern.name}</p>
            <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Domain:</strong> ${intern.domain}</p>
            <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Duration:</strong> ${intern.duration}</p>
            <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Certificate Ref:</strong> ${intern.certificateRef}</p>
            <p style="margin: 0; font-size: 13px;"><strong>Issue Date:</strong> ${intern.certificateIssueDate}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: #1d4ed8; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 700; border-radius: 6px; display: inline-block;">
              Verify Official Certificate Online ↗
            </a>
          </div>

          <p style="font-size: 13px; color: #64748b; text-align: center; margin-bottom: 24px;">
            Anyone (recruiters, colleges, employers) can verify the validity of your credential by visiting the link above or scanning the QR code on your certificate.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">Warm Regards,</p>
            <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Mr. Narendra Singh Chaudhary</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Founder & Director, Web n Code Technologies</p>
          </div>
        </div>

        <div style="background: #0f172a; padding: 16px 30px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">Web n Code Technologies • Mahapura, Ajmer Road, Jaipur, Rajasthan 302026</p>
          <p style="margin: 4px 0 0 0;"><a href="https://webncode.in" style="color: #38bdf8; text-decoration: none;">www.webncode.in</a> • webncodetechnologies@gmail.com</p>
        </div>
      </div>
    `;

    const attachments = [];
    if (pdfBase64) {
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      attachments.push({
        filename: `Certificate_${intern.name.replace(/\s+/g, '_')}.pdf`,
        content: Buffer.from(base64Data, 'base64'),
        contentType: 'application/pdf'
      });
    }

    await transporter.sendMail({
      from: getFromAddress(),
      to: intern.email,
      cc: process.env.COMPANY_EMAIL || 'webncodetechnologies@gmail.com',
      subject: `Official Internship Certificate – ${intern.name} (${intern.certificateRef})`,
      html: emailHtml,
      attachments
    });

    intern.certificateSentAt = new Date();
    await intern.save();

    res.json({
      success: true,
      message: `Certificate successfully emailed to ${intern.email}`
    });
  } catch (error) {
    console.error('Error sending certificate email:', error);
    res.status(500).json({ success: false, message: `Failed to send email: ${error.message}` });
  }
};
