import axios from 'axios';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
   console.log("🔔 upload-video called with params:", params);
   const { videoId } = await params;
  const contentType = req.headers.get('content-type') || 'application/octet-stream';

  try {
    const arrayBuffer = await req.arrayBuffer();
    const { data } = await axios.put(
      `https://video.bunnycdn.com/library/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/videos/${videoId}`,
      Buffer.from(arrayBuffer),
      {
        headers: {
          AccessKey: process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY,
          'Content-Type': contentType,
          Accept: 'application/json',
        },
      }
    );
		console.log("TCL: PUT -> 21 NextResponse");
    return NextResponse.json(data);
  } catch (err) {
    console.error("🔥 upload-video ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}