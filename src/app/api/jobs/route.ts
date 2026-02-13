import { JobModel, fetchJobs } from '@/models/Job';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  await dbConnect();
  await JobModel.deleteOne({ _id: id });
  return Response.json(true);
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const count = parseInt(searchParams.get('count') || '0', 10);

  const jobs = await fetchJobs(10 + count);
  const newJobs = jobs.slice(count);

  return NextResponse.json(newJobs);
}
