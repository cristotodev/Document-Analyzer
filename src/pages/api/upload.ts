import type { APIRoute } from "astro";
import { nanoid } from "nanoid";
import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFExtract } from "pdf.js-extract";

          
const outputDir = path.join(process.cwd(), 'public/document')

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (file == null) {
    return new Response("No file found", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();

  const pdfExtract = new PDFExtract();
  const data = await pdfExtract.extractBuffer(Buffer.from(arrayBuffer));
  const text = data.pages.map(page => page.content.map(content => content.str).join(""))
  const id = nanoid();
  fs.writeFile(`${outputDir}/${id}.txt`, text, 'utf-8')

  return new Response(JSON.stringify({
    id,
    pages: data.pages
  }));
}