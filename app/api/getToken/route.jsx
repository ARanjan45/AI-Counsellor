import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        const apiKey = process.env.ASSEMBLY_AI_KEY;
        
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        return NextResponse.json({ token: apiKey });
        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}