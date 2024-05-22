import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const question = url.searchParams.get('question');

    if(!id) {
        return new Response('Missing id', {status: 400});
    }

    if(!question){
        return new Response('Missing question', {status: 400});
    }

    return new Response(JSON.stringify({
        response: ''
    }))
}