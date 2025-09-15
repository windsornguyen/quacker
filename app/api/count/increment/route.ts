/*--------------------------------------------------------------------*/
/* Quacker (Quad + Tracker)                                           */
/* Author: Windsor Nguyen '25                                         */
/*--------------------------------------------------------------------*/

import { NextResponse } from 'next/server';
import { storage } from '../storage';

/**
 * POST endpoint to increment the count.
 * @param {Request} request - The request object containing increment value.
 * @return {Promise<NextResponse>} JSON response with new count.
 */
export async function POST(request: Request) {
  try {
    const { value = 1 } = await request.json();

    // Thread-safe increment
    const newCount = storage.increment(value);

    return NextResponse.json({ count: newCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: `Failed to increment count: ${message}` }, { status: 500 });
  }
}
