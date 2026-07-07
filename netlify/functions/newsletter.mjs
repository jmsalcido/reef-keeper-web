const MAILERLITE_SUBSCRIBERS_URL = 'https://connect.mailerlite.com/api/subscribers';

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

const isValidEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { message: 'Method not allowed.' });
  }

  let payload;

  try {
    payload = JSON.parse(event.body ?? '{}');
  } catch {
    return json(400, { message: 'Invalid request body.' });
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';

  if (!isValidEmail(email)) {
    return json(400, { message: 'Enter a valid email address.' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    return json(500, { message: 'Newsletter signup is not configured.' });
  }

  try {
    const response = await fetch(MAILERLITE_SUBSCRIBERS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 200 || response.status === 201) {
      return json(200, { message: 'Subscribed.' });
    }

    return json(502, { message: 'Newsletter signup failed. Please try again.' });
  } catch {
    return json(502, { message: 'Newsletter signup failed. Please try again.' });
  }
};
