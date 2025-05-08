import {NextResponse} from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
    try {
        // Create a session token using the sessions API
        const session = await openai.beta.realtime.sessions.create({
            model: "gpt-4o-realtime-preview-2024-12-17",
            voice: "verse",
        });

        return NextResponse.json(session);
    } catch (error) {
        console.error('Error generating WebRTC session:', error);
        return NextResponse.json(
                {error: 'Failed to generate WebRTC session'},
                {status: 500}
        );
    }
} 