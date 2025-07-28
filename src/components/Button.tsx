import { cn } from "@src/utils/classes";
import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";

export function Button({
  type = "button",
  className,
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      type={type}
      aria-label="Decrease speed"
      className={cn(
        "p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
