const MAILERLITE_SUBSCRIBERS_URL = 'https://connect.mailerlite.com/api/subscribers';
const MAILGUN_API_BASE_URL = 'https://api.mailgun.net';
const SUPPORT_EMAIL = 'reefkeeper-support@otfusion.org';

const json = (status, payload, headers = {}) =>
  Response.json(payload, {
    status,
    headers: {
      ...headers,
      'Cache-Control': 'no-store',
    },
  });

const isValidEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const getText = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

const subscribeToNewsletter = async (request, env) => {
  if (request.method !== 'POST') {
    return json(405, { message: 'Method not allowed.' }, { Allow: 'POST' });
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json(400, { message: 'Invalid request body.' });
  }

  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

  if (!isValidEmail(email)) {
    return json(400, { message: 'Enter a valid email address.' });
  }

  if (!env.MAILERLITE_API_KEY) {
    return json(500, { message: 'Newsletter signup is not configured.' });
  }

  try {
    const response = await fetch(MAILERLITE_SUBSCRIBERS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      return json(200, { message: 'Subscribed.' });
    }

    return json(502, { message: 'Newsletter signup failed. Please try again.' });
  } catch {
    return json(502, { message: 'Newsletter signup failed. Please try again.' });
  }
};

const sendSupportRequest = async (request, env) => {
  if (request.method !== 'POST') {
    return json(405, { message: 'Method not allowed.' }, { Allow: 'POST' });
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json(400, { message: 'Invalid request body.' });
  }

  const name = getText(payload?.name);
  const email = getText(payload?.email);
  const subject = getText(payload?.subject);
  const message = getText(payload?.message);
  const details = getText(payload?.details);

  if (!name || !isValidEmail(email) || !subject || !message) {
    return json(400, {
      message: 'Name, email, subject, and message are required.',
    });
  }

  if (
    name.length > 120 ||
    email.length > 254 ||
    subject.length > 200 ||
    message.length > 5000 ||
    details.length > 5000
  ) {
    return json(400, { message: 'One or more fields are too long.' });
  }

  if (!env.MAILGUN_API_KEY || !env.MAILGUN_DOMAIN) {
    return json(500, { message: 'Support intake is not configured.' });
  }

  const from =
    env.MAILGUN_FROM_EMAIL || `Reef Keeper Support <mailgun@${env.MAILGUN_DOMAIN}>`;
  const mailgunBaseUrl = (env.MAILGUN_API_BASE_URL || MAILGUN_API_BASE_URL).replace(
    /\/$/,
  );
  const mailgunUrl = `${mailgunBaseUrl}/v3/${encodeURIComponent(env.MAILGUN_DOMAIN)}/messages`;
  const mail = new URLSearchParams({
    from,
    to: SUPPORT_EMAIL,
    subject: `[Reef Keeper support] ${subject}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      message,
      '',
      'App or device details:',
      details || 'Not provided',
    ].join('\n'),
    'h:Reply-To': email,
  });

  try {
    const response = await fetch(mailgunUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: mail,
    });

    if (response.ok) {
      return json(200, { message: 'Support request sent.' });
    }

    console.error('Mailgun support request failed:', response.status);
    return json(502, { message: 'Support request could not be sent.' });
  } catch (error) {
    console.error('Mailgun support request error:', error);
    return json(502, { message: 'Support request could not be sent.' });
  }
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/newsletter') {
      return subscribeToNewsletter(request, env);
    }

    if (pathname === '/api/contact') {
      return sendSupportRequest(request, env);
    }

    return json(404, { message: 'Not found.' });
  },
};
