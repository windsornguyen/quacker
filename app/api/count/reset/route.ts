/*--------------------------------------------------------------------*/
/* Quacker (Quad + Tracker)                                           */
/* Author: Windsor Nguyen '25                                         */
/*--------------------------------------------------------------------*/

import { NextResponse } from 'next/server';

import { storage } from '../storage';

/**
 * POST endpoint to reset the count to zero.
 * @return {Promise<NextResponse>} JSON response with reset count (0).
 */
export async function POST() {
  try {
    const count = storage.reset();
    return NextResponse.json({ count });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: `Failed to reset count: ${message}` }, { status: 500 });
  }
}
