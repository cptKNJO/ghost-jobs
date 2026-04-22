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

interface DatePickerInputProps {
  id?: string;
  name?: string;
  defaultValue?: string | Date;
}

export function DatePickerInput({
  id,
  name,
  defaultValue,
}: DatePickerInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined,
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-9",
              !date && "text-muted-foreground",
            )}
          >
            <Icon name="calendar" className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
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
