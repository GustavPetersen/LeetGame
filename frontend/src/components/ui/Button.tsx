import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`ui-button ui-button--${variant}`}
    >
      {children}
    </button>
  );
}