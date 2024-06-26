import { STATUS } from "@/types/appStatus";
import type { File } from "@/types/file";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone-esm";
import { PdfIcon } from "./icon/PdfIcon";

const UploadIcon = () => {
  return (
    <svg
      className="w-10 h-10 mb-3 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      ></path>
    </svg>
  );
};

interface UploadProps {
  setStatus: (status: STATUS) => void;
  setFile: ({ id, pages }: File) => File;
}

export function Upload(props: UploadProps) {
  const { setStatus, setFile } = props;
  const [files, setFiles] = useState<string[]>([])
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/files");
      if (!res.ok) {
        setStatus(STATUS.ERROR);
        return;
      }

      const result = await res.json();
      setFiles(result)
    })();

    if (acceptedFiles.length > 0) {
      setStatus(STATUS.LOADING);

      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      (async () => {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          setStatus(STATUS.ERROR);
          return;
        }

        const result = await res.json();
        setFile(result);
      })();

      setStatus(STATUS.CHAT);
    }
  }, [acceptedFiles]);

  const handleClickPdf = (e: any) => {
    setFile({
      id: e.target.innerText,
      pages: 0
    })
    setStatus(STATUS.CHAT);
  }

  return (
    <section>
      <div>
        {files.map((file, index) => (<div key={index} className="hover:cursor-pointer" onClick={handleClickPdf}>  {file}</div>))}
      </div>
      <div
        {...getRootProps({ className: "dropzone" })}
        className="flex items-center justify-center w-full"
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF (MAX. 800x400px)
            </p>
          </div>
          <input {...getInputProps()} />
        </label>
      </div>
    </section>
  );
}
