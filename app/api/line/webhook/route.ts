import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    let groupId = 'NOT_FOUND';
    if (body.events && body.events.length > 0) {
      for (const event of body.events) {
        if (event.source && event.source.type === 'group') {
          groupId = event.source.groupId;
        }
      }
    }

    // Save to news table temporarily to read it easily
    await supabase.from('news').insert({
      title: 'GROUP_ID_LOG',
      content: groupId + ' | ' + JSON.stringify(body),
      category: 'COMPANY',
      status: 'DRAFT',
      date: new Date().toISOString()
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
