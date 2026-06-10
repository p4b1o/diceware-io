import { json } from '@sveltejs/kit'

export async function POST(event) {
    

    return json({ success: true });
  }