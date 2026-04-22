"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import { Calendar } from "@repo/ui/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Icon } from "@repo/ui/components/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@repo/ui/components/ui/input-group";

interface DatePickerInputProps {
  id?: string;
  name?: string;
  defaultValue?: string | Date;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  clearable?: boolean;
}

export function DatePickerInput({
  id,
  name,
  defaultValue,
  value: controlledValue,
  onChange,
  placeholder = "Pick a date",
  clearable = true,
}: DatePickerInputProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined,
  );

  const isControlled = controlledValue !== undefined;
  const date = isControlled ? controlledValue : internalDate;

  const handleSelect = (newDate: Date | undefined) => {
    if (!isControlled) {
      setInternalDate(newDate);
    }
    onChange?.(newDate);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelect(undefined);
  };

  return (
    <Popover>
      <InputGroup className="w-full">
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              className={cn(
                "flex-1 justify-start text-left font-normal h-full shadow-none border-0 px-2.5",
                !date && "text-muted-foreground",
              )}
            >
              <Icon name="calendar" className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>{placeholder}</span>}
            </Button>
          }
        />
        {date && clearable && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={handleClear}
              aria-label="Clear date"
            >
              <Icon name="x" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
      <input
        type="hidden"
        id={id}
        name={name}
        value={date ? date.toISOString() : ""}
      />
    </Popover>
  );
}
