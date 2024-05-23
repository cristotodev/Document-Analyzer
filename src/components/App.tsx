import { useState } from "react";
import { STATUS } from "../types/appStatus";
import { Upload } from "./Upload";
import { LoadingSpinner } from "./LoadingSpinner";
import { Chat } from "./Chat";
import { AlertError } from "./AlertError";
import type { File } from "@/types/file";

function ItemStatus({ status, setStatus, file, setFile }: { status: STATUS, setStatus: any, file: File, setFile: any }) {
  if (status === STATUS.LOADING) {
    return <LoadingSpinner text="Procesando el fichero"/>;
  }

  if (status === STATUS.CHAT) {
    return <Chat file={file}/>;
  }

  if (status === STATUS.ERROR) {
    return <AlertError title="Acción no válida" description="Estás usando un estado inválido" />
  }

  return <Upload setStatus={setStatus} setFile={setFile} />;
}

export function App() {
  const [status, setStatus] = useState<STATUS>(STATUS.CHAT);
  const [file, setFile] = useState< File>({id: '', pages: 0, url: ''});

  return <ItemStatus status={status} setStatus={setStatus} file={file} setFile={setFile} />;
}
