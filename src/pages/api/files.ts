import type { APIRoute } from "astro";
import fs from 'node:fs'
import { outputDir } from "./upload";

export const GET: APIRoute = async ({ request }) => {
    const files = await fs.readdirSync(outputDir);
    return new Response(JSON.stringify(files.map(file => file.replace(".txt", ""))));
}