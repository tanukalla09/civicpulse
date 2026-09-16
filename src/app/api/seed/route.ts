import { NextResponse } from 'next/server';
import { isCollectionEmpty } from '@/lib/firestore';
import { seedDemoData } from '@/lib/seed';

export async function GET() {
  try {
    const empty = await isCollectionEmpty();
    if (empty) {
      await seedDemoData();
      return NextResponse.json({ seeded: true, count: 12 });
    }
    return NextResponse.json({ seeded: false, message: 'Database already populated' });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
