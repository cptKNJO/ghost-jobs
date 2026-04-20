import { AlertCircle, CheckCircle2, X } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
} from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";

interface FormState {
  error?: boolean;
  success?: boolean;
  message?: string | { title: string; text: string };
}

interface FormAlertsProps {
  state: FormState | null | undefined;
  onClear?: () => void;
}

export function FormAlerts({ state, onClear }: FormAlertsProps) {
  if (!state) return null;

  const closeButton = onClear && (
    <AlertAction>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClear}
        className="h-8 w-8 text-current hover:bg-current/10"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </AlertAction>
  );

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
        {closeButton}
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
        {closeButton}
      </Alert>
    );
  }

  return null;
}
