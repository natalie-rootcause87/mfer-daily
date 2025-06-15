import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Post } from '@/lib/models/Post';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log("POST request received");
  try {
    const { content, title, address, thumbnail } = await req.json();
    if (!address) {
      return NextResponse.json({ error: 'No address provided' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: 'No mfer title provided' }, { status: 400 });
    }
    if (!thumbnail) {
      return NextResponse.json({ error: 'No thumbnail provided' }, { status: 400 });
    }

    await connectDB();

    // Check if user has already posted today with this mfer title
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingPost = await Post.findOne({
      'author.address': address,
      'author.title': title,
      'author.thumbnail': thumbnail,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'You can only post once per mfer per day' },
        { status: 400 }
      );
    }

    // Moderate content using OpenAI
    const moderation = await openai.moderations.create({
      input: content,
    });

    const post = await Post.create({
      content,
      author: {
        address,
        title,
        thumbnail,
      },
      moderated: true,
      approved: !moderation.results[0].flagged,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error creating post' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const posts = await Post.find({ approved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log('Found posts:', posts);

    const total = await Post.countDocuments({ approved: true });

    const response = {
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };

    console.log('Sending response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
} 