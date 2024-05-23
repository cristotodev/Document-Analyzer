import type { File } from "@/types/file";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { AlertError } from "./AlertError";

interface ChatProps {
  file: File;
}

export function Chat(props: ChatProps) {
  const [loading, setLoading] = useState(false);
  const [apiAnswer, setApiAnswer] = useState<string>('');
  const [error, setError] = useState<{ title: string, description: string }>()
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
    //searchParams.append('id', file.id);
    searchParams.append('id', '65047c58c185bd39b2b0fd149881e025');
    searchParams.append('question', question);

    const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`)
    eventSource.onerror = (event) => {
      setLoading(false);
      setError({
        title: 'Error con tu asistente',
        description: 'Revisa que el modelo que estás usando es el correcto y si ollama está instalado.'
      })
      eventSource.close();

      setTimeout(() => {
        setError(undefined);
      }, 5000)
    }

    eventSource.onmessage = (event) => {
      setLoading(false);
      const incomingData = JSON.parse(event.data)
      if (incomingData === "__END__") {
        setApiAnswer(prevState => prevState + incomingData)
        eventSource.close()
        return;
      }

      setApiAnswer(prevState => prevState + incomingData)
    }

  }

  return (
    <div className="max-w-screen-md mx-auto overflow-hidden h-auto overflow-y-auto">
      <div className="grid grid-cols-4 gap-2">
        {images.map((img) => (
          <img
            src={img}
            alt="PDF page"
            className="rounded w-full h-auto aspect-[400/540]"
          />
        ))}
      </div>
      {error ? (
        <div className="mb-10">
          <AlertError title={error.title} description={error.description} />
        </div>
      ) : undefined}


      {loading ? (
        <div>
          <LoadingSpinner text="Esperando respuesta ..." />
        </div>
      ) : undefined}

      {apiAnswer ? (
        <div className="mt-8 mb-8 bg-gray-400">
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
        <Button type="submit">Consultar</Button>
      </form>
    </div>

  );
}
