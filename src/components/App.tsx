import { useState } from "react";
import { STATUS } from "../types/appStatus";
import { Upload } from "./Upload";
import { LoadingSpinner } from "./LoadingSpinner";
import { Chat } from "./Chat";
import { AlertError } from "./AlertError";
import type { File } from "@/types/file";

function ItemStatus({ status, setStatus, file, setFile }: { status: STATUS, setStatus: any, file: File, setFile: any }) {
  if (status === STATUS.LOADING) {
    return <LoadingSpinner text="Procesando el fichero" />;
  }

  if (status === STATUS.CHAT) {
    return <Chat file={file} />;
  }

  if (status === STATUS.ERROR) {
    return <AlertError title="Acción no válida" description="Estás usando un estado inválido" />
  }

  return <Upload setStatus={setStatus} setFile={setFile} />;
}

export function App() {
  const [status, setStatus] = useState<STATUS>(STATUS.INIT);
  const [file, setFile] = useState<File>({ id: '', pages: 0 });
  const [history, setHistory] = useState<{ date: Date, titles: string[] }[]>([]);

  const handleNewChat = () => {
    setStatus(STATUS.INIT);
  }

  return (
    <>
      <div className="bg-white w-1/6 flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary">
        <nav className="flex h-full w-full flex-col px-3 pb-3.5 juice:pb-0">
          <div className="flex h-14 items-center justify-end">
            <button onClick={handleNewChat} className="h-10 rounded-lg px-2.5 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" viewBox="0 0 24 24" className="icon-xl-heavy"><path d="M15.673 3.913a3.121 3.121 0 1 1 4.414 4.414l-5.937 5.937a5 5 0 0 1-2.828 1.415l-2.18.31a1 1 0 0 1-1.132-1.13l.311-2.18A5 5 0 0 1 9.736 9.85zm3 1.414a1.12 1.12 0 0 0-1.586 0l-5.937 5.937a3 3 0 0 0-.849 1.697l-.123.86.86-.122a3 3 0 0 0 1.698-.849l5.937-5.937a1.12 1.12 0 0 0 0-1.586M11 4A1 1 0 0 1 10 5c-.998 0-1.702.008-2.253.06-.54.052-.862.141-1.109.267a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216C5.001 8.471 5 9.264 5 10.4v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h3.2c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.126-.247.215-.569.266-1.108.053-.552.06-1.256.06-2.255a1 1 0 1 1 2 .002c0 .978-.006 1.78-.069 2.442-.064.673-.192 1.27-.475 1.827a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C15.6 21 14.727 21 13.643 21h-3.286c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.233-.487-1.961C3 15.6 3 14.727 3 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.729.185-1.369.487-1.961A5 5 0 0 1 5.73 3.545c.556-.284 1.154-.411 1.827-.475C8.22 3.007 9.021 3 10 3A1 1 0 0 1 11 4"></path></svg>
            </button>
          </div>
          {history.map((value) => (
            <div className="flex flex-col gap-2 pb-2 text-token-text-primary text-sm juice:mt-5">
              <div className="relative mt-5 empty:mt-0 empty:hidden juice:first:mt-0 juice:last:mb-5">
                <span className="text-xl font-bold">{value.date.toString()}</span>
              </div>
              <ol>
                {value.titles.map(title => (
                  <li className="relative z-[15] cursor-pointer">{title}</li>
                ))}
              </ol>
            </div>
          ))}

        </nav>
      </div>
      <main className="grid place-content-center min-h-screen w-screen">
        <h1 className="text-6xl opacity-80 font-bold text-center pb-10 text-white">
          Chat with your document
        </h1>
        <section className="text-white">
          <ItemStatus status={status} setStatus={setStatus} file={file} setFile={setFile} />
        </section>
      </main></>

  );

}
