import OpenAI from "openai";
import { ExpertList } from "./Options";

export const getToken = async () => {
    const result = await fetch('/api/getToken');
    const data = await result.json();
    return data.token;
}

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
    dangerouslyAllowBrowser: true
})

export const AIModel = async (feeling, feelingOption, msg) => {
    console.log('feelingOption received:', feelingOption);
    console.log('Available:', ExpertList.map(e => e.name));

    const option = ExpertList.find((item) => item.name == feelingOption);

    if (!option) {
        console.error('Expert not found for:', feelingOption);
        return 'Sorry, I could not find the right expert for this session.';
    }

    // Append the user's feeling to the prompt
    const PROMPT = option.prompt + ` The user has shared that they are feeling: "${feeling}". Start the conversation by acknowledging this.`;

    const completion = await openai.chat.completions.create({
    model: 'openrouter/free',  // ✅ auto-selects best available free model
    messages: [
        {
            role: 'assistant',
            content: PROMPT
        },
        {
            role: 'user',
            content: msg
        }
    ],
});

    console.log('AI Response:', completion.choices[0].message);
    return completion.choices[0].message.content;
}