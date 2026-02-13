import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '0', 10);

    if (!apiKey || !listId) {
      return NextResponse.json({ error: 'Newsletter service not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ message: 'Successfully subscribed!' });
    }

    const data = await response.json();

    if (data.code === 'duplicate_parameter') {
      return NextResponse.json({ error: 'You are already subscribed!' }, { status: 409 });
    }

    return NextResponse.json({ error: data.message || 'Subscription failed' }, { status: 400 });
  } catch (err: any) {
    console.error('Newsletter signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
