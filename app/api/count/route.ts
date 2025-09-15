/*--------------------------------------------------------------------*/
/* Quacker (Quad + Tracker)                                           */
/* Author: Windsor Nguyen '25                                         */
/*--------------------------------------------------------------------*/

import { NextResponse } from 'next/server';

import { storage } from './storage';

/**
 * GET endpoint to retrieve the current count.
 * @return {Promise<NextResponse>} JSON response with current count.
 */
export async function GET() {
  try {
    const count = storage.getCount();
    return NextResponse.json({ count });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: `Failed to get count: ${message}` }, { status: 500 });
  }
}
