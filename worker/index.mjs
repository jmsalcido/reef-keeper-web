const MAILERLITE_SUBSCRIBERS_URL = 'https://connect.mailerlite.com/api/subscribers';

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

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/newsletter') {
      return subscribeToNewsletter(request, env);
    }

    return json(404, { message: 'Not found.' });
  },
};
