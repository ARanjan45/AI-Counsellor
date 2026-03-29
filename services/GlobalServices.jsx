import { ExpertList } from "./Options";

export const getToken = async () => {
    const result = await fetch('/api/getToken');
    const data = await result.json();
    return data.token;
}

const cleanResponse = (text) => {
    let response = text;
    response = response.replace(/\*[^*]*\*/g, '');
    response = response.replace(/\*\*[^*]*\*\*/g, '');
    response = response.replace(/\([^)]*\)/g, '');
    response = response.replace(/[\*#_~`]/g, '');
    response = response.replace(/^\s*[-•]\s*/gm, '');
    response = response.replace(/\d+\.\s*/g, '');
    response = response.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    response = response.replace(/\s+/g, ' ').trim();
    return response;
};

const buildGeminiHistory = (conversationHistory) => {
    const history = [];
    for (const msg of conversationHistory) {
        const role = msg.role === 'assistant' ? 'model' : 'user';
        if (history.length > 0 && history[history.length - 1].role === role) {
            history[history.length - 1].parts[0].text += ' ' + msg.content;
        } else {
            history.push({ role, parts: [{ text: msg.content }] });
        }
    }
    if (history.length > 0 && history[0].role === 'model') {
        history.shift();
    }
    return history;
};

export const AIModel = async (expertList, feeling, conversationHistory, newMsg) => {
    const option = ExpertList.find((item) => item.name == expertList);
    if (!option) {
        console.error('Expert not found for:', expertList);
        return 'Sorry, I could not find the right expert for this session.';
    }

    const PROMPT = option.prompt + ` The user initially shared that they are feeling: "${feeling}". Use this as context throughout the session.`;

    try {
        const history = buildGeminiHistory(conversationHistory);
        const requestBody = {
            system_instruction: {
                parts: [{
                    text: `${PROMPT}
You are a voice-based AI counsellor. Speak naturally and warmly like a real human counsellor. Never use markdown, asterisks, emojis, bullet points, or stage directions. Plain conversational sentences only. Never start with "I'm so glad you reached out" after the first message. Balance listening, validating, sharing insight, and asking ONE follow-up question. Never ask multiple questions in one response.
CRITICAL SAFETY RULE: If the user mentions suicide, self-harm, wanting to die, hurting themselves or others, or any crisis situation, you MUST respond with deep empathy first, then naturally include these helplines in your response: iCall India: 9152987821, Vandrevala Foundation: 1860-2662-345, AASRA: 9820466627. Say something like "I also want to make sure you have access to immediate support — you can reach iCall at 9 1 5 2 9 8 7 8 2 1 any time." Keep the tone warm, never clinical.`
                }]
            },
            contents: [
                ...history,
                { role: 'user', parts: [{ text: newMsg }] }
            ],
            generationConfig: { temperature: 0.85, maxOutputTokens: 300 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }
        );

        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return cleanResponse(data.candidates[0].content.parts[0].text);
        } else {
            console.error('Gemini error:', JSON.stringify(data));
            return 'I am here with you. Could you share that again?';
        }
    } catch (err) {
        console.error('Gemini error:', err);
        return 'I am here with you. Could you share that again?';
    }
}

export const textToSpeech = (text, expertName) => {
    return new Promise(async (resolve) => {
        try {
            // Format phone numbers to be read digit by digit
            const formattedText = text
                .replace(/\b(\d{10})\b/g, (match) => match.split('').join(' '))
                .replace(/\b(\d{4})-(\d{4})-(\d{3})\b/g, (_, a, b, c) =>
                    `${a.split('').join(' ')} ${b.split('').join(' ')} ${c.split('').join(' ')}`
                );

            const voiceMap = {
                'Joanna': { name: 'en-IN-Neural2-A', gender: 'FEMALE' },
                'Sallie': { name: 'en-IN-Neural2-D', gender: 'FEMALE' },
                'Mathhew': { name: 'en-IN-Neural2-B', gender: 'MALE' },
            };

            const voice = voiceMap[expertName] || { name: 'en-IN-Neural2-A', gender: 'FEMALE' };

            const response = await fetch(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.NEXT_PUBLIC_GOOGLE_TTS_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        input: { text: formattedText },
                        voice: {
                            languageCode: 'en-IN',
                            name: voice.name,
                            ssmlGender: voice.gender
                        },
                        audioConfig: {
                            audioEncoding: 'MP3',
                            speakingRate: 0.9,
                            pitch: 0.0
                        }
                    })
                }
            );

            const data = await response.json();
            if (data.audioContent) {
                const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
                audio.onended = () => resolve(audio);
                audio.play();
            } else {
                console.error('Google TTS error:', data);
                resolve(null);
            }
        } catch (err) {
            console.error('Google TTS failed, falling back to browser TTS:', err);
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => resolve(null);
            window.speechSynthesis.speak(utterance);
        }
    });
}

export const generateFeedback = async (conversation) => {
    console.log('generateFeedback called with', conversation?.length, 'messages');
    if (!conversation || conversation.length === 0) {
        console.log('No conversation to generate feedback from');
        return null;
    }

    const conversationText = conversation
        .map(m => `${m.role === 'user' ? 'User' : 'Counsellor'}: ${m.content}`)
        .join('\n');

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{
                            text: `You are a mental health counsellor reviewing a session transcript. Based on the conversation below, generate a structured session summary. Return ONLY a valid JSON object. No markdown, no backticks, no extra text before or after. Exactly this format:
{"summary":"2-3 sentence overview","keyPoints":["point 1","point 2","point 3"],"insights":"one paragraph about the user emotional state","actionItems":["action 1","action 2"],"mood":"one word mood"}

Conversation:
${conversationText}`
                        }]
                    }],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
                })
            }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('Raw feedback text:', text);

        if (!text) {
            console.error('No text in feedback response:', JSON.stringify(data));
            return null;
        }

        // Extract JSON object from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('No JSON found in feedback text:', text);
            return null;
        }

        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Feedback parsed successfully:', parsed);
        return parsed;

    } catch (err) {
        console.error('Feedback generation error:', err);
        return null;
    }
}