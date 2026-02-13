'use server';

import { JobModel } from '@/models/Job';
import dbConnect from '@/lib/dbConnect';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  companyName: z.string().min(1, 'Company name is required'),
  type: z.string().optional(),
  seniority: z.enum(['intern', 'junior', 'mid-level', 'senior']),
  description: z.string().min(1, 'Description is required'),
  salary: z.number().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Valid email required'),
  applyLink: z.string().optional(),
  expiresOn: z.string().optional(),
  plan: z.string().optional(),
  blockAIApplications: z.boolean().optional(),
  policyTags: z.array(z.string()).optional(),
});

export async function saveJobAction(formData: FormData) {
  await dbConnect();

  const data: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (key === 'salary') {
      data[key] = value ? Number(value) : undefined;
    } else if (key === 'blockAIApplications') {
      data[key] = value === 'true';
    } else if (key === 'policyTags') {
      try { data[key] = JSON.parse(value as string); } catch { data[key] = []; }
    } else {
      data[key] = value;
    }
  });

  const parsed = jobSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') };
  }

  try {
    const jobId = formData.get('id') as string | null;

    if (jobId) {
      await JobModel.findByIdAndUpdate(jobId, parsed.data);
      revalidatePath('/jobs');
      return { success: true, jobId };
    } else {
      const jobData = {
        ...parsed.data,
        plan: parsed.data.plan || 'pending',
        policyTags: parsed.data.policyTags || [],
      };
      const job = await JobModel.create(jobData);
      revalidatePath('/jobs');
      return { success: true, jobId: job._id.toString() };
    }
  } catch (error: any) {
    console.error('Error saving job:', error);
    return { error: error.message || 'Failed to save job' };
  }
}

export async function updateJobStatusAfterPayment(jobId: string, plan: string) {
  await dbConnect();

  try {
    await JobModel.findByIdAndUpdate(jobId, { plan });
    revalidatePath('/jobs');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating job status:', error);
    return { error: error.message || 'Failed to update job status' };
  }
}

export async function searchJobsAction(searchPhrase: string, limit: number = 10) {
  await dbConnect();

  try {
    const regex = new RegExp(searchPhrase, 'i');
    const jobs = await JobModel.find(
      {
        $or: [
          { title: { $regex: regex } },
          { companyName: { $regex: regex } },
          { description: { $regex: regex } },
        ],
        plan: { $nin: ['pending'] },
      },
      {},
      { sort: '-createdAt', limit }
    );

    return JSON.parse(JSON.stringify(jobs));
  } catch (error: any) {
    console.error('Error searching jobs:', error);
    return [];
  }
}
