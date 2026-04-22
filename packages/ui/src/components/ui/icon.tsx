"use client";

import * as React from "react";
import {
  SunIcon,
  MoonIcon,
  DesktopIcon,
  WarningCircleIcon,
  CheckCircleIcon,
  XIcon,
  QuestionIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BriefcaseIcon,
  PlusIcon,
  TrashIcon,
  ArrowSquareOutIcon,
  EyeIcon,
  CalendarIcon,
  CaretDownIcon,
  CaretUpIcon,
  CaretRightIcon,
  CaretLeftIcon,
  CheckIcon,
  BuildingsIcon,
  InfoIcon,
  IconProps as PhosphorIconProps,
  Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { cn } from "@repo/ui/lib/utils";

export const icons = {
  sun: SunIcon,
  moon: MoonIcon,
  desktop: DesktopIcon,
  "warning-circle": WarningCircleIcon,
  "check-circle": CheckCircleIcon,
  x: XIcon,
  "file-question": QuestionIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-left": ArrowLeftIcon,
  briefcase: BriefcaseIcon,
  plus: PlusIcon,
  trash: TrashIcon,
  "external-link": ArrowSquareOutIcon,
  eye: EyeIcon,
  calendar: CalendarIcon,
  "caret-down": CaretDownIcon,
  "caret-up": CaretUpIcon,
  "caret-right": CaretRightIcon,
  "caret-left": CaretLeftIcon,
  check: CheckIcon,
  buildings: BuildingsIcon,
  info: InfoIcon,
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends Omit<PhosphorIconProps, "color"> {
  name: IconName;
  color?: string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, className, size = 18, weight = "regular", ...props }, ref) => {
    const IconComponent = icons[name] as PhosphorIcon;

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in dictionary.`);
      return null;
    }

    return (
      <IconComponent
        ref={ref}
        size={size}
        weight={weight}
        className={cn("shrink-0", className)}
        {...props}
      />
    );
  },
);

Icon.displayName = "Icon";
