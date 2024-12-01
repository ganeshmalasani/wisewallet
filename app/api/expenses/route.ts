import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'

export async function GET() {
  const db = await getDb();
  const expenses = await db.all('SELECT * FROM expenses ORDER BY date DESC');
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  const { category, amount, date } = await request.json();
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO expenses (category, amount, date) VALUES (?, ?, ?)',
    [category, amount, date]
  );
  return NextResponse.json({ id: result.lastID });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const db = await getDb();
  await db.run('DELETE FROM expenses WHERE id = ?', id);
  return NextResponse.json({ success: true });
}

