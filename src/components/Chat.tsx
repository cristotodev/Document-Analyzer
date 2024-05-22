import type { File } from "@/types/file";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, type FormEvent } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ChatProps {
  file: File;
}

export function Chat(props: ChatProps) {
  const [loading, setLoading] = useState(false);
  const [apiAnswer, setApiAnswer] = useState<string>();
  const { file } = props;

  const numOfImagesToShow = Math.min(file.pages, 4);
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1;
    return file.url
      .replace("/upload/", `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace(".pdf", ".jpg");
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setLoading(true);

    const question = event.target.question.value;
    const searchParams = new URLSearchParams();
    searchParams.append('id', file.id);
    searchParams.append('question', question);
    try {
      const res = await fetch(`/api/ask?${searchParams.toString()}`, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) {
        console.log("error");
        setLoading(false);
        return;
      }

      const { answer } = await res.json();
      console.log(answer);

      setApiAnswer("respuesta desde la api");
    } catch (e) {
        //TODO Ver como gestionar el error
        console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img) => (
          <img
            src={img}
            alt="PDF page"
            className="rounded w-full h-auto aspect-[400/540]"
          />
        ))}
      </div>

      {loading ? (
        <div>
          <LoadingSpinner text="Esperando respuesta ..." />
        </div>
      ) : undefined}

      {apiAnswer ? (
        <div className="mt-8 bg-gray-400">
          <p className="font-medium">Respuesta:</p>
          <p>{apiAnswer}</p>
        </div>
      ) : undefined}

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center space-x-2 text-black"
      >
        <Input
          id="question"
          type="text"
          placeholder="¿En qué consiste este documento?"
          required
        />
        <Button type="submit">Preguntar</Button>
      </form>
    </>
  );
}
