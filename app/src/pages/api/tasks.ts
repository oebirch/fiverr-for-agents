import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, description, budget, deadline } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          budget,
          deadline,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ task: data[0] });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
