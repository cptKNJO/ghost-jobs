"use client";

import * as React from "react";
import { CalendarIcon } from "@phosphor-icons/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Calendar } from "@repo/ui/components/ui/calendar";

interface DatePickerProps {
  id?: string;
  name?: string;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

function formatDate(date: Date | undefined) {
  console.log(date);
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function DatePickerInput({
  id,
  name,
  defaultValue,
  onChange,
  placeholder = "Select date...",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Internal state to manage the UI display
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    // setValue(formatDate(newDate));
    setMonth(newDate);

    // Notify TanStack Form or parent
    // onChange?.(newDate);
  };

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const date = e.target.value;
          setValue(date);
          if (isValidDate(date)) {
            handleDateChange(date);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <InputGroupButton
                type="button" // Prevent form submission
                variant="ghost"
                size="icon-xs"
                aria-label="Open calendar"
              >
                <CalendarIcon />
              </InputGroupButton>
            }
          />
          <PopoverContent className="w-auto p-0" align="end" sideOffset={10}>
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date));
                setOpen(false);
              }}
              timeZone={timeZone}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
