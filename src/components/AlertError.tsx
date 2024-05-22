import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertError() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Acción no válida</AlertTitle>
      <AlertDescription>Estás usando un estado inválido</AlertDescription>
    </Alert>
  );
}
