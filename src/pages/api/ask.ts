import { modelContext } from "@/utils/aiModelContext";
import { responseSSE } from "@/utils/sse";
import type { APIRoute } from "astro";
import { readFile } from 'node:fs/promises';
import ollama from 'ollama';

const model = import.meta.env.OLLAMA_MODEL || 'phi3';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const question = url.searchParams.get('question');

    if (!id) {
        return new Response('Missing id', { status: 400 });
    }

    if (!question) {
        return new Response('Missing question', { status: 400 });
    }

    const documentContent = await readFile(`public/document/${id}.txt`, 'utf-8')
    const modelfile = `
    FROM "${model}"
    SYSTEM "${modelContext}"
    `;

    try {
        await ollama.create({
            model,
            modelfile
        });
    } catch (error) {
        return new Response("Error al crear el modelo", {status: 500});
    }
    
    const message = { role: 'user', content: `<context>${documentContent}</context><question>${question}</question>` }
    return responseSSE({ request }, async (sendEvent) => {
        const response = await ollama.chat({ model, messages: [message], stream: true });
        
        sendEvent('__NEW_QUESTION__');

        for await (const part of response) {
            sendEvent(part.message.content)
        }

        sendEvent('__END__')
    });

}