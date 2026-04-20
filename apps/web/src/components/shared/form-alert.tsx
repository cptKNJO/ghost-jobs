import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/ui/alert";

interface FormState {
  error?: boolean;
  success?: boolean;
  message?: string | { title: string; text: string };
}

interface FormAlertsProps {
  state: FormState | null | undefined;
}

export function FormAlerts({ state }: FormAlertsProps) {
  if (!state) return null;

  // Handle Error State
  if (state.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {typeof state.message === "string"
            ? state.message
            : state.message?.text || "An error occurred."}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle Success State
  if (state.success) {
    const isComplexMessage = typeof state.message === "object";

    return (
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        {isComplexMessage && state.message.title && (
          <AlertTitle>{state.message.title}</AlertTitle>
        )}
        <AlertDescription>
          {isComplexMessage ? state.message.text : state.message}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
