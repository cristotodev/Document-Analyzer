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
  const [chatHistory, setChatHistory] = useState<{ question: string, answer: string }[]>([]);
  const [error, setError] = useState<{ title: string, description: string }>()
  const [blockAction, setBlockAction] = useState(false);
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

    if(blockAction) return;

    setBlockAction(true);
    setLoading(true);

    const question = event.target.question.value;
    const searchParams = new URLSearchParams();
    //searchParams.append('id', file.id);
    searchParams.append('id', '65047c58c185bd39b2b0fd149881e025');
    searchParams.append('question', question);

    const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`)
    eventSource.onerror = (event) => {
      setLoading(false);
      setBlockAction(false);
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
        setBlockAction(false);
        eventSource.close()
        return;
      }

      if (incomingData.startsWith("__NEW_QUESTION__")) {
        setChatHistory(prevChatHistory => [
          ...prevChatHistory,
          { question: question, answer: "" },
        ]);
      } else {
        setChatHistory(prevChatHistory => {
          const lastIndex = prevChatHistory.length - 1;
          if (lastIndex >= 0) {
            prevChatHistory[lastIndex].answer += incomingData;
          }
          return [...prevChatHistory];
        });
      }
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

      {chatHistory.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md text-black">
          {chatHistory.map((item, index) => (
            <div key={index}>
              <div className="flex justify-end mt-4">
                <p className="bg-gray-300 p-2 rounded-lg shadow-md font-medium inline-block">{item.question}</p>
              </div>
              <div className="mt-4 flex justify-start">
                <p className="bg-white p-2 rounded-lg shadow-md  font-medium">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center space-x-2 text-black mt-8"
      >
        <Input
          id="question"
          type="text"
          placeholder="¿En qué consiste este documento?"
          required
          disabled={blockAction}
        />
        <Button type="submit" disabled={blockAction}>Consultar</Button>
      </form>
    </div>

  );
}
