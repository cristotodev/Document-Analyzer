import type { APIRoute } from "astro";
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: 'cristotodev',
    api_key: import.meta.env.CLOUDINARY_PUBLIC,
    api_secret: import.meta.env.CLOUDINARY_SECRET
});

const uploadStream = async (buffer: Uint8Array, options: {
    folder: string,
    ocr?: string,
}): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(options, (error, result) => {
            if (result) resolve(result);
            reject(error);
        });
    });
}

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return new Response('File not found', { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const result = await uploadStream(uint8Array, {
        folder: 'pdf',
        ocr:'adv_ocr'
    })

    const { asset_id: id, secure_url: url, pages, info } = result;
    const data = info?.ocr?.adv_ocr?.data;

    const text = data.map((blocks: {textAnnotations: {description: string}[]}) => {
        const annotations = blocks['textAnnotations'];
        const first = annotations[0] ?? {};
        const content = first['description'] ?? '';
        return content.trim();
    }).filter(Boolean).join('\n');


    //TODO Subir a una BD con el id
    // let id = "aa";
    // let url = "asda";
    // let pages = 2
;
    return new Response(JSON.stringify({
        id, url, pages
    }))
}