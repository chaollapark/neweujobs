import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Niche } from '@/models/Niche';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const niche = await Niche.findOne({ slug: params.slug }).lean();
    
    if (!niche) {
      return NextResponse.json({ error: 'Niche not found' }, { status: 404 });
    }
    
    return NextResponse.json(niche);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json();
    await connectDB();
    
    const niche = await Niche.findOneAndUpdate(
      { slug: params.slug },
      { ...data, slug: params.slug },
      { upsert: true, new: true }
    );
    
    return NextResponse.json(niche);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
