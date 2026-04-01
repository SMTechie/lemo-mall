import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#ffff00] !text-[#0b0b0b] shadow-[0_14px_30px_rgba(0,0,0,0.22)] hover:brightness-95",
  secondary:
    "border border-white/15 bg-[#111111] text-[#f8f4e8] shadow-[0_12px_30px_rgba(0,0,0,0.22)] hover:bg-[#1a1a1a]",
  ghost: "bg-transparent text-[#f8f4e8] hover:bg-white/8",
  outline:
    "border border-[#ffff00]/35 bg-transparent text-[#ffff00] hover:bg-[#ffff00]/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-60",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
}
