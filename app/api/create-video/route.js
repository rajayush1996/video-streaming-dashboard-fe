import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { title, contentType } = await req.json();
//   console.log(process.env);
  try {
    const { data } = await axios.post(
      `https://video.bunnycdn.com/library/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/videos`,
      { title, contentType},
      {
        headers: {
          AccessKey: process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error creating Bunny Stream slot:', err);
    return NextResponse.json({ error: err.message, err }, { status: 500 });
  }
}
