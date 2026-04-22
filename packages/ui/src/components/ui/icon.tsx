import * as React from "react";
import {
  Sun,
  Moon,
  Desktop,
  WarningCircle,
  CheckCircle,
  X,
  FileQuestion,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Plus,
  Trash,
  ArrowSquareOut,
  Eye,
  Calendar,
  CaretDown,
  CaretUp,
  CaretRight,
  Check,
  Buildings,
  Info,
  IconProps as PhosphorIconProps,
  Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { cn } from "@repo/ui/lib/utils";

export const icons = {
  sun: Sun,
  moon: Moon,
  desktop: Desktop,
  "warning-circle": WarningCircle,
  "check-circle": CheckCircle,
  x: X,
  "file-question": FileQuestion,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  briefcase: Briefcase,
  plus: Plus,
  trash: Trash,
  "external-link": ArrowSquareOut,
  eye: Eye,
  calendar: Calendar,
  "caret-down": CaretDown,
  "caret-up": CaretUp,
  "caret-right": CaretRight,
  check: Check,
  buildings: Buildings,
  info: Info,
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
