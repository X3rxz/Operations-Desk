import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const { notes, files } = await request.json()
    const content = [
      { type: 'text' as const, text: `Create concise meeting minutes from these visual sources${notes ? ` and supplementary notes: ${notes}` : ''}. Return ONLY valid JSON with keys: title, date, time, location, attendees, discussions (array), decisions (array), actions (array), review (array). Treat the uploaded files as visual inputs: inspect handwriting, diagrams, screenshots, and layout. Do not describe filenames. Mark uncertain or unreadable details in review.` },
      ...(files || []).map((file: { data: string; type: string }) => ({ type: 'image' as const, image: file.data, mediaType: file.type })),
    ]
    const { text } = await generateText({ model: 'google/gemini-3-flash', messages: [{ role: 'user', content }] })
    const json = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json({ output: json, message: 'Visual source analyzed. Review any flagged details before sharing.' })
  } catch (error) {
    console.error('[v0] visual MOTM analysis failed', error)
    return NextResponse.json({ error: 'Visual analysis unavailable' }, { status: 500 })
  }
}
