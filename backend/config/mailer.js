require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Creates and returns configured Nodemailer SMTP transporter
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'mail.webncode.in';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'business@webncode.in';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Returns formatted sender string
 */
const getFromAddress = () => {
  const name = process.env.EMAIL_FROM_NAME || 'Web n Code Technologies';
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'business@webncode.in';
  return `"${name}" <${user}>`;
};

module.exports = { createTransporter, getFromAddress };
