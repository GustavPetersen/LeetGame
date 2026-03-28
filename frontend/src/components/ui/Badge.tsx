import type { ReactNode } from "react";

type BadgeVariant =
  | "easy"
  | "medium"
  | "hard"
  | "neutral"
  | "info"
  | "success";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

export default function Badge({
  children,
  variant = "neutral",
}: BadgeProps) {
  return <span className={`ui-badge ui-badge--${variant}`}>{children}</span>;
}