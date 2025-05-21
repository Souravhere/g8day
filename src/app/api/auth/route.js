import { parse } from '@telegram-apps/init-data-node';

export async function POST(request) {
  const { initData } = await request.json();
  const botToken = process.env.BOT_TOKEN;

  try {
    const data = parse(initData, { botToken });
    return new Response(JSON.stringify({ user: data.user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid initData' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
