import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'

export async function POST(request: Request) {
  const { query } = await request.json()
  const db = await getDb()

  try {
    const result = await db.all(query)
    // Check if result is null or undefined
    if (!result || result.length === 0) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error executing query:', error)
    return NextResponse.json({ error: 'Error executing query' }, { status: 500 })
  }
}
