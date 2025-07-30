import { cn } from "@src/utils/classes";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

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
        "rounded-full bg-gray-700 p-2 hover:bg-gray-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
