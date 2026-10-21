// src/lib/brevo.js

/**
 * Sends an email using Brevo's REST API.
 * @param {Object} params
 * @param {string} params.toEmail - Recipient email address
 * @param {string} [params.toName] - Recipient name
 * @param {string} params.subject - Email subject
 * @param {string} params.htmlContent - HTML content or template string
 */
export async function sendEmail({ toEmail, toName = '', subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    throw new Error('Missing Brevo API Key or Sender Email in environment variables.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'Project App',
        email: senderEmail,
      },
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
      subject: subject,
      htmlContent: htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Brevo API Error: ${errorData.message || response.statusText}`);
  }

  return await response.json();
}