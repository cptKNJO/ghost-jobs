import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
} from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";
import { useEffect, useState } from "react";
import { Icon } from "@repo/ui/components/ui/icon";

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
  const [isVisible, setIsVisible] = useState(true);

  // Re-show alert when state changes (e.g. new error/success)
  useEffect(() => {
    if (state) {
      setIsVisible(true);
    }
  }, [state]);

  if (!state || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClear?.();
  };

  const closeButton = (
    <AlertAction>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleClose}
        className="h-8 w-8 text-current hover:bg-current/10"
      >
        <Icon name="x" className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </AlertAction>
  );

  // Handle Error State
  if (state.error) {
    const isComplexMessage = typeof state.message === "object";
    return (
      <Alert variant="destructive">
        <Icon name="warning-circle" className="h-4 w-4" />
        {isComplexMessage && state.message.title && (
          <AlertTitle>{state.message.title}</AlertTitle>
        )}
        <AlertDescription>
          {isComplexMessage
            ? state.message.text
            : state.message || "An error occurred."}
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
        <Icon name="check-circle" className="h-4 w-4" />
        <div className="flex-1">
          {isComplexMessage && state.message.title && (
            <AlertTitle>{state.message.title}</AlertTitle>
          )}
          <AlertDescription>
            {isComplexMessage ? state.message.text : state.message}
          </AlertDescription>
        </div>
        {closeButton}
      </Alert>
    );
  }

  return null;
}
