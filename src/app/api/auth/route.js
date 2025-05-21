import { NextResponse } from 'next/server';
import { validate } from '@telegram-apps/init-data-node';

export async function POST(request) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json({ error: 'initData is required.' }, { status: 400 });
    }

    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token is not configured.' }, { status: 500 });
    }

    const initDataObj = validate(initData, botToken);

    const user = initDataObj.user;

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: 'Invalid initData.' }, { status: 401 });
  }
}
